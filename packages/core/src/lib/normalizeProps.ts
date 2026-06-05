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
    htmlFor: "for",
  };

  // Normalize common camelCase aliases to their HTML attribute equivalents.
  // Keep existing dashed attributes if present (they take precedence).
  for (const [camel, dashed] of Object.entries(propMapping)) {
    if (camel in out && !(dashed in out)) {
      out[dashed] = out[camel];
      delete out[camel];
    } else {
      // warning should be devtime only, if we're passing in a prop that isn't in propMapping, we should warn the user that it won't be normalized
      if (process.env.NODE_ENV === "development" && camel in out) {
        console.warn(
          `Warning: Prop "${camel}" is not a recognized attribute and will not be normalized. 
          Please use the correct HTML attribute name if applicable  or update the propMapping.`,
        );
      }
    }
  }

  return out;
}

export default normalizeProps;
