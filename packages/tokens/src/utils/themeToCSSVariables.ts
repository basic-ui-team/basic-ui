import type ThemeConfig from "../types/index";
import { PREFIX_MAP } from "../constants";

export interface ThemeObj {
  customProperties: Record<string, string | number>;
  tokens: Record<string, any>;
}

// Simple WeakMap cache keyed by the theme object identity. This speeds up repeated
// calls with the same theme instance (common for default presets).
const THEME_CACHE: WeakMap<object, ThemeObj> = new WeakMap();

/**
 * Convert a ThemeConfig into CSS custom properties and a token mirror.
 * Optimized for lower allocations and memoized for repeated theme objects.
 */
export function themeToCSSVariables(theme: ThemeConfig): ThemeObj {
  if (!theme || typeof theme !== "object") {
    return { customProperties: {}, tokens: {} };
  }

  const cached = THEME_CACHE.get(theme as object);
  if (cached) return cached;

  const props: Record<string, string | number> = {};
  const tokens: Record<string, any> = {};

  // Use for..in loops to avoid intermediate arrays from Object.entries()
  for (const category in theme) {
    if (!Object.prototype.hasOwnProperty.call(theme, category)) continue;
    const values = (theme as any)[category];
    if (!values || typeof values !== "object") continue;

    const prefix = PREFIX_MAP[category as keyof ThemeConfig];
    if (!prefix) continue;

    const categoryTokens: Record<string, any> = {};
    tokens[category] = categoryTokens;

    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;
      const value = values[key];

      if (value && typeof value === "object") {
        const nestedObj: Record<string, any> = {};
        categoryTokens[key] = nestedObj;
        for (const nestedKey in value) {
          if (!Object.prototype.hasOwnProperty.call(value, nestedKey)) continue;
          const nestedValue = (value as any)[nestedKey];
          if (nestedValue == null) continue;
          const varName = `--${prefix}-${key}-${nestedKey}`;
          props[varName] = nestedValue as string | number;
          nestedObj[nestedKey] = `${key}-${nestedKey}`;
        }
      } else {
        if (value == null) continue;
        const varName = `--${prefix}-${key}`;
        props[varName] = value as string | number;
        categoryTokens[key] = key;
      }
    }
  }

  const result: ThemeObj = { customProperties: props, tokens };
  THEME_CACHE.set(theme as object, result);
  return result;
}
