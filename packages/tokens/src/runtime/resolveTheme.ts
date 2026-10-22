import type ThemeConfig from "../types";
import type { ResolvedTheme } from "../types";

/**
 * Resolve a theme configuration into its final form. The custom spacing
 * scale was removed in favor of Tailwind's native linear spacing (`--spacing`
 * multiplier), so resolution is an identity pass kept for API stability.
 */
export function resolveTheme(theme: ThemeConfig): ResolvedTheme {
  return theme as ResolvedTheme;
}
