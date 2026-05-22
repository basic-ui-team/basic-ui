import type { Breakpoint, ResponsiveValue } from "./types";
import { useBreakpoint } from "../useBreakpoint/useBreakpoint";

/**
 * Type guard to narrow ResponsiveValue<T> to a responsive object.
 * Returns true if value is a responsive object (not a primitive or array).
 *
 * @internal
 */
function isResponsiveObject<T>(
  value: ResponsiveValue<T>,
): value is { base: T } & Partial<Record<Exclude<Breakpoint, "base">, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "base" in value;
}


/**
 * Hook that resolves responsive values to the current breakpoint.
 * @template T - The type of value at each breakpoint.
 * @param responsiveValue - Primitive, array, or object with `base` (required) and optional `sm`, `md`, `lg`, `xl`, `xxl` keys.
 * @returns Resolved value for current breakpoint, falls back to `base` if higher breakpoint undefined.
 * @example
 * ```tsx
 * const padding = useResponsive({ base: "sm", sm: "sm", md: "md", lg: "lg" });
 * const showSidebar = useResponsive({ base: false, lg: true });
 * ```
 */
export function useResponsive<T>(responsiveValue: ResponsiveValue<T>): T {
  // Prefer a single shared breakpoint source so we don't create a media listener
  // per responsive prop. `useBreakpoint` uses a shared matchMedia set and
  // subscribes via `useSyncExternalStore` for efficient updates.
  const currentBreakpoint = useBreakpoint();

  if (!isResponsiveObject(responsiveValue)) return responsiveValue as T;

  // Cascade down to the largest defined breakpoint value
  // E.g., if at xxl but only xl is defined, use xl; if at xl but only lg is defined, use lg; if at lg but only base is defined, use base
  const breakpointOrder: Breakpoint[] = ["base", "sm", "md", "lg", "xl", "xxl"];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (
      bp === "base" ||
      (bp in responsiveValue && responsiveValue[bp as keyof typeof responsiveValue] !== undefined)
    ) {
      return responsiveValue[bp as keyof typeof responsiveValue] ?? responsiveValue.base;
    }
  }

  return responsiveValue.base;
}
