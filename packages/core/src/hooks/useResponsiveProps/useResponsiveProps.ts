import { useMemo } from "react";
import { useResponsive } from "../useResponsive/useResponsive";
import type { ResponsiveValue } from "../useResponsive/types";

/**
 * Hook to resolve a set of responsive props in a single call.
 *
 * IMPORTANT: the set and order of keys passed must be stable across renders.
 */
export function useResponsiveProps<
  T extends Record<string, ResponsiveValue<any> | undefined>,
>(props: T, orderedKeys?: (keyof T)[]) {
  const keys = (orderedKeys ?? (Object.keys(props) as (keyof T)[])) as (keyof T)[];

  // Call useResponsive for each prop in a deterministic order
  const resolvedValues = keys.map((k) => useResponsive(props[k] as any));

  return useMemo(() => {
    const out = {} as { [K in keyof T]: T[K] extends ResponsiveValue<infer U> ? U | undefined : never };
    keys.forEach((k, i) => {
      (out as any)[k] = resolvedValues[i];
    });
    return out;
  }, [...resolvedValues]);
}

export default useResponsiveProps;
