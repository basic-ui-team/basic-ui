import { useMemo } from "react";
import type { ResponsiveValue } from "../useResponsive/types";
import { BREAKPOINT_ORDER } from "../useResponsive/constants";
import { useBreakpoint } from "../useBreakpoint/useBreakpoint";

/**
 * Hook to resolve a set of responsive props in a single call.
 *
 * IMPORTANT: the set and order of keys passed must be stable across renders.
 */
export function useResponsiveProps<T extends Record<string, ResponsiveValue<any> | undefined>>(
  props: T,
  orderedKeys?: (keyof T)[],
) {
  const currentBreakpoint = useBreakpoint();

  const keys = useMemo(
    () => orderedKeys ?? (Object.keys(props) as (keyof T)[]),
    [orderedKeys, props],
  );

  // Resolve responsive props in a deterministic order
  return useMemo(() => {
    const result = {} as any;

    for (const key of keys) {
      const value = props[key];
      if (value === undefined) continue;

      // Resolve responsive value inline (no extra hook calls)
      if (typeof value === "object" && value !== null && !Array.isArray(value) && "base" in value) {
        // Walk down from current breakpoint to base
        result[key] = resolveBreakpointValue(value, currentBreakpoint);
      } else {
        result[key] = value;
      }
    }

    return result;
  }, [props, currentBreakpoint, keys]);
}

// Helper function (pure, no hooks)
function resolveBreakpointValue<T>(responsiveObj: Record<string, T>, currentBreakpoint: string): T {
  const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint as (typeof BREAKPOINT_ORDER)[number]);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = BREAKPOINT_ORDER[i];
    if (bp in responsiveObj && responsiveObj[bp] !== undefined) {
      return responsiveObj[bp];
    }
  }

  return responsiveObj.base;
}
