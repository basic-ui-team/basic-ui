import type ThemeConfig from "../types";
import type { ResolvedTheme } from "../types";
import { DEFAULT_SPACING_SCALE, resolveSpacingScale } from "../scales/spacing";

export function resolveTheme(theme: ThemeConfig): ResolvedTheme {
  const spacingConfig = {
    ...DEFAULT_SPACING_SCALE,
    ...theme.spacing,
    overrides: {
      ...DEFAULT_SPACING_SCALE.overrides,
      ...theme.spacing?.overrides,
    },
  };
  const spacingScale = resolveSpacingScale(spacingConfig);

  return {
    ...theme,
    spacing: spacingScale,
  } as ResolvedTheme;
}
