import ThemeConfig from "../types/index";
import { PREFIX_MAP } from "../constants";

export interface ThemeObj {
  customProperties: Record<string, string | number>;
  tokens: Record<string, any>;
}

/**
 * New version of themeToCSSVariables that handles nested objects for colors (ramps and semantic roles).
 * E.g., color: { bg: { base: "hsl(...)" } } → --color-bg-base: hsl(...)
 *
 * Returns both:
 * - customProperties: CSS custom property name → value for use in styles
 * - tokens: Mirror of theme structure with var() references for programmatic access (e.g., tokens.color.bg.base)
 */
export function themeToCSSVariables(theme: ThemeConfig): ThemeObj {
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
            const tokenName = `${key}-${nestedKey}`;
            const varName = `--${prefix}-${tokenName}`;
            props[varName] = nestedValue as string | number;
            // Store the reference so users can do: tokens.color.bg.base. Tailwind v4 doesn't need var().
            tokens[category][key][nestedKey] = tokenName as string | number;
          }
        });
      } else {
        // Handle primitive values (e.g., spacing.md)
        if (value !== undefined && value !== null) {
          const tokenName = `${key}`;
          const varName = `--${prefix}-${tokenName}`;
          props[varName] = value as string | number;
          // Store the var() reference
          tokens[category][key] = tokenName as string | number;
        }
      }
    });
  });

  return {
    customProperties: props,
    tokens,
  };
}
