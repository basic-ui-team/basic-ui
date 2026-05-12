import { ThemeConfig } from "@tokens/types";

/**
 * Extracts tokens from a theme configuration for a specific category (e.g., colors, spacing).
 * This is used internally to generate CSS variables and Tailwind presets.
 */
export function extractTokens(
  theme: ThemeConfig,
  category: keyof ThemeConfig,
): Record<string, string | number> {
  const prefixMap: Record<string, string> = {
    colors: "color",
    spacing: "spacing",
    radius: "radius",
    shadows: "shadow",
    fontSize: "font-size",
    fontWeight: "font-weight",
    lineHeight: "line-height",
    letterSpacing: "tracking",
    fontFamily: "font",
    duration: "duration",
    easing: "easing",
    zIndex: "z-index",
    container: "container",
    opacity: "opacity",
  };

  const prefix = prefixMap[category] || category;
  const tokens: Record<string, string | number> = {};

  if (theme[category]) {
    Object.entries(theme[category]!).forEach(([key, value]) => {
      tokens[`${prefix}-${key}`] = value!;
    });
  }

  return tokens;
}
