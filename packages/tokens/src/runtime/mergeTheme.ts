import type ThemeConfig from "../types";
import type { ResolvedTheme, ThemeOverride } from "../types";
import { mergeThemeConfig } from "./mergeThemeConfig";
import { resolveTheme } from "./resolveTheme";

/**
 * Deep merge two theme configurations, with the override taking precedence.
 * This recursively merges nested objects so that partial overrides don't
 * clobber sibling properties deeper in the shape (e.g. color ramps).
 */
export function mergeTheme(base: ThemeConfig, override: ThemeOverride): ResolvedTheme {
  const mergedConfig = mergeThemeConfig(base, override);
  return resolveTheme(mergedConfig);
}
