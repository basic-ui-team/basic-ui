import { ThemeConfig } from "@tokens/types";
import { convertToKebabCase } from "./css-var";
import { PREFIX_MAP } from "..";

/**
 * Extracts tokens from a theme configuration for a specific category (e.g., colors, spacing).
 * This is used internally to generate CSS variables and Tailwind presets.
 */
export function extractTokens(
  theme: ThemeConfig,
  category: keyof ThemeConfig,
): Record<string, string | number> {
  const prefix = PREFIX_MAP[category as keyof typeof PREFIX_MAP] || convertToKebabCase(category);
  const tokens: Record<string, string | number> = {};

  if (theme[category]) {
    Object.entries(theme[category]!).forEach(([key, value]) => {
      tokens[`${prefix}-${key}`] = value!;
    });
  }

  return tokens;
}
