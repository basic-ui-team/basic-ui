import { renderHookWithProviders, waitFor } from "../../test-utils";
import { act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { BREAKPOINTS } from "../useResponsive/constants";
import { useBreakpoint, resetForTesting } from "./useBreakpoint";

type MqlEntry = {
  matches: boolean;
  media: string;
  listeners: Set<EventListenerOrEventListenerObject>;
};

function createMatchMediaMock(initial?: Record<string, boolean>) {
  const map = new Map<string, { entry: MqlEntry; obj: any }>();

  function make(query: string) {
    if (map.has(query)) return map.get(query)!.obj;

    const entry: MqlEntry = { matches: !!initial?.[query], media: query, listeners: new Set() };

    const obj = {
      get matches() {
        return entry.matches;
      },
      media: entry.media,
      onchange: null,
      addEventListener(event: string, handler: EventListener) {
        if (event === "change") entry.listeners.add(handler);
      },
      removeEventListener(event: string, handler: EventListener) {
        if (event === "change") entry.listeners.delete(handler);
      },
      addListener(handler: EventListener) {
        entry.listeners.add(handler);
      },
      removeListener(handler: EventListener) {
        entry.listeners.delete(handler);
      },
      dispatch() {
        const ev = { matches: entry.matches, media: entry.media } as unknown as Event;
        // copy listeners to avoid mutation during iteration
        for (const l of Array.from(entry.listeners)) {
          try {
            // listeners may be functions or objects with handleEvent
            if (typeof l === "function") (l as Function)(ev as any);
            else if (typeof (l as any).handleEvent === "function")
              (l as any).handleEvent(ev as any);
          } catch (err) {
            // swallow test errors from listeners
          }
        }
      },
    };

    map.set(query, { entry, obj });
    return obj;
  }

  return {
    matchMedia: (query: string) => make(query),
    setMatchesForQuery(query: string, matches: boolean) {
      const item = map.get(query) || ({ obj: make(query) } as any);
      item.entry.matches = matches;
      item.obj.dispatch();
    },
    getListenerCount(query: string) {
      const item = map.get(query);
      return item ? item.entry.listeners.size : 0;
    },
  };
}

let originalMatchMedia: typeof window.matchMedia;

describe("useBreakpoint (shared media queries)", () => {
  beforeEach(() => {
    // reset module cache to ensure hook re-inits with our mock
    vi.resetModules();
    originalMatchMedia = window.matchMedia;
    resetForTesting();
  });

  afterEach(() => {
    // restore original matchMedia so other tests are unaffected
    // Guard in case a test removed `window` (SSR simulation)
    if (typeof window !== "undefined") {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("returns 'base' when no breakpoints match", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const { result, unmount } = renderHookWithProviders(() => useBreakpoint());
    expect(result.current).toBe("base");

    unmount();
  });

  it("updates when breakpoint matches change", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const { result } = renderHookWithProviders(() => useBreakpoint());
    expect(result.current).toBe("base");

    const mdQuery = `(min-width: ${BREAKPOINTS.md}px)`;

    // At least one listener should be attached to the md query after mount
    expect(mm.getListenerCount(mdQuery)).toBeGreaterThanOrEqual(1);

    // Simulate md matching
    act(() => mm.setMatchesForQuery(mdQuery, true));

    await waitFor(() => {
      expect(result.current).toBe("md");
    });
  });

  it("chooses the largest matching breakpoint (mobile-first last wins)", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const { result } = renderHookWithProviders(() => useBreakpoint());

    const smQuery = `(min-width: ${BREAKPOINTS.sm}px)`;
    const mdQuery = `(min-width: ${BREAKPOINTS.md}px)`;

    act(() => mm.setMatchesForQuery(smQuery, true));
    await waitFor(() => expect(result.current).toBe("sm"));

    act(() => mm.setMatchesForQuery(mdQuery, true));
    await waitFor(() => expect(result.current).toBe("md"));
  });

  it("removes shared listeners on unsubscribe (teardown)", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const mdQuery = `(min-width: ${BREAKPOINTS.md}px)`;

    const { unmount } = renderHookWithProviders(() => useBreakpoint());

    // after mount, there should be listeners attached
    expect(mm.getListenerCount(mdQuery)).toBeGreaterThanOrEqual(1);

    // unmount -> should trigger unsubscribe and teardown
    unmount();

    // All listeners should have been removed from shared MediaQueryList objects
    expect(mm.getListenerCount(mdQuery)).toBe(0);
  });

  it("handles environments without window or matchMedia (SSR)", () => {
    // Simulate SSR-like environment by removing `matchMedia` from window
    // (keeping `window` defined so testing-library can render)
    const originalMatch = (window as any).matchMedia;
    delete (window as any).matchMedia;
    const { result, unmount } = renderHookWithProviders(() => useBreakpoint());
    expect(result.current).toBe("base");
    // restore
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatch,
    });
    unmount();
  });
});
