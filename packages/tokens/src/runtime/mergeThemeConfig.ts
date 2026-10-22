import type ThemeConfig from "../types";
import type { ThemeOverride } from "../types";

export function mergeThemeConfig(base: ThemeConfig, override: ThemeOverride): ThemeConfig {
  return deepMergeObjects(base, override) as ThemeConfig;
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMergeObjects(
  base: Record<string, any> = {},
  override: Record<string, any> = {},
): Record<string, any> {
  const result: Record<string, any> = { ...base };

  for (const key of Object.keys(override)) {
    const ov = override[key];
    const bv = base[key];

    if (isPlainObject(bv) && isPlainObject(ov)) {
      result[key] = deepMergeObjects(bv, ov);
    } else {
      result[key] = ov;
    }
  }

  return result;
}
