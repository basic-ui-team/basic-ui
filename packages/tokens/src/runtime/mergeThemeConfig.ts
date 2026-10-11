import type ThemeConfig from "../types";
import type { ThemeOverride } from "../types";

export function mergeThemeConfig(base: ThemeConfig, override: ThemeOverride): ThemeConfig {
  const { spacing: baseSpacing, ...baseWithoutSpacing } = base;
  const { spacing: overrideSpacing, ...overrideWithoutSpacing } = override;

  const mergedWithoutSpacing = deepMergeObjects(baseWithoutSpacing, overrideWithoutSpacing);

  const mergedSpacing =
    baseSpacing === undefined && overrideSpacing === undefined
      ? undefined
      : deepMergeObjects(baseSpacing, overrideSpacing);

  return mergedSpacing === undefined
    ? mergedWithoutSpacing
    : {
        ...mergedWithoutSpacing,
        spacing: mergedSpacing as ThemeConfig["spacing"],
      };
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
