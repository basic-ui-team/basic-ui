/**
 * Utility function to normalize React props by converting common camelCase aliases to their standard HTML attribute equivalents.
 * This allows users to use more convenient prop names while ensuring the correct attributes are applied to DOM elements.
 * For example, `ariaLabel` will be converted to `aria-label`, and `htmlFor` will be converted to `for`.
 */
export function normalizeProps<T extends Record<string, unknown> = Record<string, unknown>>(
  props?: T,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(props ?? {}) };

  const propMapping: Record<string, string> = {
    ariaLabel: "aria-label",
    ariaDescribedBy: "aria-describedby",
    ariaLabelledBy: "aria-labelledby",
    ariaHidden: "aria-hidden",
    ariaLive: "aria-live",
    ariaRequired: "aria-required",
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

  // Dev-time warning: if callers pass camelCase props that aren't recognized
  // (and therefore won't be normalized), warn them so they can correct usage
  // or add a mapping. This iterates the original `props` keys rather than the
  // mapping itself so we can detect unknown camelCase aliases.
  if (process.env.NODE_ENV === "development" && props) {
    for (const key of Object.keys(props as Record<string, unknown>)) {
      // Treat keys containing uppercase letters as camelCase aliases (e.g., ariaLabel, htmlFor)
      if (/[A-Z]/.test(key) && !(key in propMapping)) {
        console.warn(
          `Warning: Prop "${key}" will not be normalized. Recognized aliases: ${Object.keys(
            propMapping,
          ).join(", ")}. Use dashed attribute names (e.g. \"aria-label\") or add a mapping.`,
        );
      }
    }
  }

  return out;
}

export default normalizeProps;
