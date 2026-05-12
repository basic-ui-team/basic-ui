
/**
 * Generate a CSS custom property name from category and key
 * @example tokenName("color", "primary") → "--color-primary"
 */
export function tokenName(
  category: string,
  key: string,
): string {
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
    easing: "ease",
    zIndex: "z",
    container: "container",
    opacity: "opacity",
  };

  const prefix = prefixMap[category] || convertToKebabCase(category);
  return `--${prefix}-${key}`;
}

/**
 * Generate a CSS variable reference from category and key
 * @example cssVar("color", "primary") → "var(--color-primary)"
 */
export function cssVar(
  category: string,
  key: string,
): string {
  return `var(${tokenName(category, key)})`;
}

/**
 * Convert camelCase/PascalCase to kebab-case
 * @internal
 */
export function convertToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
