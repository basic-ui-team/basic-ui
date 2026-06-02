import { ThemeConfig } from "@tokens/types";

/**
 * Deep merge two theme configurations, with the override taking precedence.
 * This is used internally to combine the default theme with user overrides.
 */
export function mergeTheme<T extends ThemeConfig>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key as keyof T]) {
      result[key as keyof T] = {
        ...base[key as keyof T],
        ...override[key as keyof T],
      };
    }
  }
  return result;
}