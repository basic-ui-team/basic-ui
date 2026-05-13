import { ThemeConfig } from "../types";
import { PREFIX_MAP } from "../constants";

/**
 * Convert a ThemeConfig to a flat record of CSS custom property name → value.
 * Used by both runtime `createTheme()` and build-time CSS generation.
 *
 * @example
 * const props = themeToCustomProperties({
 *   colors: { primary: "hsl(119 43% 52%)" },
 *   spacing: { md: "1rem" },
 * });
 * // → {
 * //   "--color-primary": "hsl(119 43% 52%)",
 * //   "--spacing-md": "1rem",
 * // }
 */
export function themeToCustomProperties(theme: ThemeConfig): Record<string, string | number> {
  const props: Record<string, string | number> = {};

  Object.entries(theme).forEach(([category, values]) => {
    if (!values || typeof values !== "object") return;

    const prefix = PREFIX_MAP[category as keyof ThemeConfig];
    if (!prefix) return;

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        props[`--${prefix}-${key}`] = value as string | number;
      }
    });
  });

  return props;
}
