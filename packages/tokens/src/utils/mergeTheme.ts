import type ThemeConfig from "../types/index";

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

/**
 * Deep merge two theme configurations, with the override taking precedence.
 * This recursively merges nested objects so that partial overrides don't
 * clobber sibling properties deeper in the shape (e.g. color ramps).
 */
export function mergeTheme(
  base: ThemeConfig,
  override: Partial<ThemeConfig>,
): ThemeConfig {
  const result = { ...base } as ThemeConfig;

  for (const category in override) {
    const overrideCategory = override[category as keyof ThemeConfig];
    if (overrideCategory === undefined) continue;

    const baseCategory = base[category as keyof ThemeConfig];

    if (isPlainObject(baseCategory) && isPlainObject(overrideCategory)) {
      result[category as keyof ThemeConfig] = deepMergeObjects(baseCategory, overrideCategory);
    } else {
      result[category as keyof ThemeConfig] = overrideCategory as any;
    }
  }

  return result;
}
