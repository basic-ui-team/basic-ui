import { ThemeConfig } from "../types";
import { ThemeConfig as NewThemeConfig } from "../types/index";
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

export interface ThemeObj {
  customProperties: Record<string, string | number>;
  tokens: Record<string, any>;
}

/**
 * New version of themeToCustomProperties that handles nested objects for colors (ramps and semantic roles).
 * E.g., color: { bg: { base: "hsl(...)" } } → --color-bg-base: hsl(...)
 *
 * Returns both:
 * - customProperties: CSS custom property name → value for use in styles
 * - tokens: Mirror of theme structure with var() references for programmatic access (e.g., tokens.color.bg.base)
 */
export function newThemeToCustomProperties(theme: NewThemeConfig): ThemeObj {
  const props: Record<string, string | number> = {};
  const tokens: Record<string, any> = {};

  Object.entries(theme).forEach(([category, values]) => {
    if (!values || typeof values !== "object") return;

    const prefix = PREFIX_MAP[category as keyof ThemeConfig];
    if (!prefix) return;

    // Initialize the category in tokens
    tokens[category] = {};

    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        // Handle nested objects (e.g., colors.bg.base)
        tokens[category][key] = {};
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            const varName = `--${prefix}-${key}-${nestedKey}`;
            props[varName] = nestedValue as string | number;
            // Store the var() reference so users can do: tokens.color.bg.base
            tokens[category][key][nestedKey] = `var(${varName})`;
          }
        });
      } else {
        // Handle primitive values (e.g., spacing.md)
        if (value !== undefined && value !== null) {
          const varName = `--${prefix}-${key}`;
          props[varName] = value as string | number;
          // Store the var() reference
          tokens[category][key] = `var(${varName})`;
        }
      }
    });
  });

  return {
    customProperties: props,
    tokens,
  };
}
