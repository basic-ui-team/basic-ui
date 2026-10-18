import type { Breakpoint } from "./constants";

export type { Breakpoint };

/** A value that can be either a single value or an object mapping breakpoints to values.
 *  When using an object, `base` is required; omitted breakpoints inherit the latest
 *  supplied value through the mobile-first CSS cascade.
 *  @example
 *  size="md"  // static
 *  size={{ base: "sm", md: "md", lg: "lg" }}  // xl and 2xl retain "lg"
 *  size={{ base: "sm", sm: "sm", md: "md", lg: "lg", xl: "lg", "2xl": "xl" }}  // full responsive */
export type ResponsiveValue<T> =
  | T
  | ({ base: T } & Partial<Record<Exclude<Breakpoint, "base">, T>>);
