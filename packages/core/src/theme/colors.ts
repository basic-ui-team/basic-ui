export const BUILT_IN_SEMANTIC_COLORS = [
  "default",
  "muted",
  "primary",
  "secondary",
  "error",
  "success",
  "warning",
  "info",
] as const;

export type BuiltInSemanticColors = (typeof BUILT_IN_SEMANTIC_COLORS)[number];

export const isBuiltInSemanticColor = (value: unknown): value is BuiltInSemanticColors =>
  typeof value === "string" && (BUILT_IN_SEMANTIC_COLORS as readonly string[]).includes(value);

