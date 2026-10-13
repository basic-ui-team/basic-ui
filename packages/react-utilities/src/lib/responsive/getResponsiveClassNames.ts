import { BREAKPOINT_ORDER } from "../../hooks/useResponsive/constants";
import type { Breakpoint, ResponsiveValue } from "../../hooks/useResponsive/types";

export type ResponsiveClassNameResolver<Value> = (value: Value) => string | undefined;

type ResponsiveObject<Value> = { base: Value } & Partial<
  Record<Exclude<Breakpoint, "base">, Value>
>;

function isResponsiveValue<Value>(
  value: ResponsiveValue<Value>,
): value is ResponsiveObject<Value> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "base" in value;
}

function prefixClasses(className: string, prefix?: string): string[] {
  const classes = className.trim().split(/\s+/).filter(Boolean);
  return prefix ? classes.map((utility) => `${prefix}:${utility}`) : classes;
}

/**
 * Converts a responsive value into ordered Tailwind utility classes without
 * reading viewport state. Responsive objects emit base classes followed by
 * their explicitly supplied breakpoint overrides.
 */
export function getResponsiveClassNames<Value>(
  value: ResponsiveValue<Value> | undefined,
  resolveClassName: ResponsiveClassNameResolver<Value>,
): string {
  if (value === undefined) return "";

  if (!isResponsiveValue(value)) {
    return resolveClassName(value) ?? "";
  }

  return BREAKPOINT_ORDER.flatMap((breakpoint) => {
    const responsiveValue = value[breakpoint];
    if (responsiveValue === undefined) return [];

    const className = resolveClassName(responsiveValue);
    return className ? prefixClasses(className, breakpoint === "base" ? undefined : breakpoint) : [];
  }).join(" ");
}
