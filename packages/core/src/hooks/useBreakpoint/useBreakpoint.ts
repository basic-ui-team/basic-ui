import { useSyncExternalStore } from "react";

import { Breakpoint } from "../useResponsive/types";
import { BREAKPOINTS } from "../useResponsive/constants";

type MediaQueryLists = Partial<Record<Exclude<Breakpoint, "base">, MediaQueryList>>;

const queries: Record<Exclude<Breakpoint, "base">, string> = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(min-width: ${BREAKPOINTS.xxl}px)`,
};

let mqls: MediaQueryLists | null = null;
export const listeners = new Set<() => void>();
let handleChange: (() => void) | null = null;

function initMqls() {
  if (typeof window === "undefined" || !("matchMedia" in window)) return;
  if (mqls) return;

  mqls = {
    sm: window.matchMedia(queries.sm),
    md: window.matchMedia(queries.md),
    lg: window.matchMedia(queries.lg),
    xl: window.matchMedia(queries.xl),
    xxl: window.matchMedia(queries.xxl),
  };

  // Store the handler at module scope so we can remove it later when there
  // are no subscribers.
  handleChange = () => {
    for (const l of listeners) l();
  };

  // Attach listeners (support old `addListener` for older browsers / test envs)
  for (const mq of Object.values(mqls)) {
    if (!mq || !handleChange) continue;
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handleChange as EventListener);
    } else if (typeof (mq as any).addListener === "function") {
      (mq as any).addListener(handleChange);
    }
  }
}

function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "base";
  initMqls();
  if (!mqls) return "base";

  // Mobile-first: iterate sm->md->lg->xl->xxl and let the last match win
  let current: Breakpoint = "base";
  const order: Exclude<Breakpoint, "base">[] = ["sm", "md", "lg", "xl", "xxl"];
  for (const bp of order) {
    const mq = mqls[bp];
    if (mq?.matches) current = bp;
  }

  return current;
}

function subscribe(listener: () => void) {
  initMqls();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);

    // If no more subscribers, remove the shared matchMedia listeners and
    // release resources. This avoids keeping browser listeners around when
    // the app no longer needs them (useful for tests and single-page
    // navigation boundaries).
    if (listeners.size === 0 && mqls && handleChange) {
      for (const mq of Object.values(mqls)) {
        if (!mq) continue;
        if (typeof mq.removeEventListener === "function") {
          mq.removeEventListener("change", handleChange as EventListener);
        } else if (typeof (mq as any).removeListener === "function") {
          (mq as any).removeListener(handleChange);
        }
      }

      // Clear stored references
      mqls = null;
      handleChange = null;
    }
  };
}

/**
 * Hook that returns the current active breakpoint as a string: 'base' | 'sm' | ...
 * This uses a single shared set of matchMedia listeners for the entire app,
 * so many components can call `useBreakpoint()` without duplicating listeners.
 */
/* v8 ignore start -- @preserve */
export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getCurrentBreakpoint, () => "base");
}

export function resetForTesting() {
  if (typeof window === "undefined") return;

  if (mqls && handleChange) {
    for (const mq of Object.values(mqls)) {
      if (!mq) continue;
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handleChange as EventListener);
      } else if (typeof (mq as any).removeListener === "function") {
        (mq as any).removeListener(handleChange);
      }
    }
  }

  // Reset module state
  mqls = null;
  listeners.clear();
  handleChange = null;
}
/* v8 ignore stop -- @preserve */

export default useBreakpoint;
