export const BUILT_IN_TEXT_COLORS = [
  "default",
  "muted",
  "primary",
  "secondary",
  "error",
  "success",
  "warning",
  "info",
] as const;

export const BUILT_IN_HEADER_COLORS = ["default", "primary", "secondary"] as const;

export type BuiltInTextColor = (typeof BUILT_IN_TEXT_COLORS)[number];

export type BuiltInHeaderColor = (typeof BUILT_IN_HEADER_COLORS)[number];

export const isBuiltInTextColor = (value: unknown): value is BuiltInTextColor =>
  typeof value === "string" && (BUILT_IN_TEXT_COLORS as readonly string[]).includes(value);

export const isBuiltInHeaderColor = (value: unknown): value is BuiltInHeaderColor =>
  typeof value === "string" && (BUILT_IN_HEADER_COLORS as readonly string[]).includes(value);

export default BUILT_IN_TEXT_COLORS;
