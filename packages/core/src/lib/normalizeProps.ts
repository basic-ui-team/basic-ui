export function normalizeProps<T extends Record<string, unknown> = Record<string, unknown>>(
  props?: T,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(props ?? {}) };

  const propMapping: Record<string, string> = {
    ariaLabel: "aria-label",
    ariaDescribedBy: "aria-describedby",
    ariaLabelledBy: "aria-labelledby",
    htmlFor: "for",
  };

  // Normalize common camelCase aliases to their HTML attribute equivalents.
  // Keep existing dashed attributes if present (they take precedence).
  for (const [camel, dashed] of Object.entries(propMapping)) {
    if (camel in out && !(dashed in out)) {
      out[dashed] = out[camel];
      delete out[camel];
    }
  }

  return out;
}

export default normalizeProps;
