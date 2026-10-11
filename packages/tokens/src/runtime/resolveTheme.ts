import type ThemeConfig from "../types";
import type { ResolvedTheme } from "../types";
import { DEFAULT_SPACING_SCALE, resolveSpacingScale } from "../scales/spacing";

export function resolveTheme(theme: ThemeConfig): ResolvedTheme {
  const spacingScale = resolveSpacingScale(theme.spacing ?? DEFAULT_SPACING_SCALE);

  return {
    ...theme,
    spacing: spacingScale,
  } as ResolvedTheme;
}
