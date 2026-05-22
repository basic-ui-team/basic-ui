import { renderHookWithProviders, waitFor } from "../../test-utils";
import { act } from "@testing-library/react";
import { useResponsive } from "./useResponsive";
import { BREAKPOINTS } from "./constants";

function createMatchMediaMock(initial?: Record<string, boolean>) {
  const map = new Map<
    string,
    { matches: boolean; listeners: Set<EventListenerOrEventListenerObject> }
  >();

  function make(query: string) {
    if (map.has(query)) return map.get(query)!;

    const entry = {
      matches: !!initial?.[query],
      listeners: new Set<EventListenerOrEventListenerObject>(),
    };
    map.set(query, entry);
    return entry;
  }

  return {
    matchMedia: (query: string) => {
      const entry = make(query);
      return {
        get matches() {
          return entry.matches;
        },
        media: query,
        onchange: null,
        addListener: (listener: EventListenerOrEventListenerObject) =>
          entry.listeners.add(listener),
        removeListener: (listener: EventListenerOrEventListenerObject) =>
          entry.listeners.delete(listener),
        addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
          if (type === "change") entry.listeners.add(listener);
        },
        removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
          if (type === "change") entry.listeners.delete(listener);
        },
        dispatchEvent: (_event: Event) => false,
      } as MediaQueryList;
    },
    setMatchesForQuery: (query: string, matches: boolean) => {
      const entry = make(query);
      entry.matches = matches;
      entry.listeners.forEach((listener) => {
        if (typeof listener === "function") {
          (listener as EventListener)({ matches } as MediaQueryListEvent);
        } else {
          (listener as EventListenerObject).handleEvent({ matches } as MediaQueryListEvent);
        }
      });
    },
  };
}

describe("useResponsive", () => {
  it("returns primitive value directly", () => {
    const { result } = renderHookWithProviders(() => useResponsive("hello"));
    expect(result.current).toBe("hello");
  });

  it("returns base value when no breakpoints match", () => {
    const { result } = renderHookWithProviders(() =>
      useResponsive({ base: "base", sm: "sm", md: "md" }),
    );
    expect(result.current).toBe("base");
  });

  it("returns correct value for current breakpoint", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const { result } = renderHookWithProviders(() =>
      // Note: intentionally omit `lg` to verify fallback to `md` when `lg` matches
      useResponsive({ base: "base", sm: "sm", md: "md" }),
    );

    const smQuery = `(min-width: ${BREAKPOINTS.sm}px)`;
    const mdQuery = `(min-width: ${BREAKPOINTS.md}px)`;

    act(() => mm.setMatchesForQuery(smQuery, true));
    await waitFor(() => {
      expect(result.current).toBe("sm");
    });

    act(() => mm.setMatchesForQuery(mdQuery, true));
    await waitFor(() => {
      expect(result.current).toBe("md");
    });

    // If lg is not defined, should fall back to md
    act(() => mm.setMatchesForQuery(`(min-width: ${BREAKPOINTS.lg}px)`, true));
    await waitFor(() => {
      expect(result.current).toBe("md");
    });

    // Cleanup: reset lg match to avoid affecting other tests
    act(() => mm.setMatchesForQuery(`(min-width: ${BREAKPOINTS.lg}px)`, false));
  });

  it("cascades down to largest defined breakpoint", async () => {
    const mm = createMatchMediaMock();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mm.matchMedia,
    });

    const { result } = renderHookWithProviders(() =>
      useResponsive({ base: "base", md: "md", xl: "xl" }),
    );

    const smQuery = `(min-width: ${BREAKPOINTS.sm}px)`;
    const mdQuery = `(min-width: ${BREAKPOINTS.md}px)`;
    const lgQuery = `(min-width: ${BREAKPOINTS.lg}px)`;
    const xlQuery = `(min-width: ${BREAKPOINTS.xl}px)`;

    act(() => mm.setMatchesForQuery(smQuery, true));
    await waitFor(() => {
      expect(result.current).toBe("base");
    });

    act(() => mm.setMatchesForQuery(mdQuery, true));
    await waitFor(() => {
      expect(result.current).toBe("md");
    });

    act(() => mm.setMatchesForQuery(lgQuery, true));
    await waitFor(() => {
      // lg is not defined, should fall back to md
      expect(result.current).toBe("md");
    });

    act(() => mm.setMatchesForQuery(xlQuery, true));
    await waitFor(() => {
      expect(result.current).toBe("xl");
    });

    // Cleanup: reset matches to avoid affecting other tests
    act(() => mm.setMatchesForQuery(smQuery, false));
    act(() => mm.setMatchesForQuery(mdQuery, false));
    act(() => mm.setMatchesForQuery(lgQuery, false));
    act(() => mm.setMatchesForQuery(xlQuery, false));
  });
});
