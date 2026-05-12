import { PREFIX_MAP } from "../constants";

/**
 * Generate a CSS custom property name from category and key
 * @example tokenName("color", "primary") → "--color-primary"
 */
export function tokenName(category: string, key: string): string {
  const prefix = PREFIX_MAP[category as keyof typeof PREFIX_MAP] || convertToKebabCase(category);
  return `--${prefix}-${key}`;
}

/**
 * Generate a CSS variable reference from category and key
 * @example cssVar("color", "primary") → "var(--color-primary)"
 */
export function cssVar(category: string, key: string): string {
  return `var(${tokenName(category, key)})`;
}

/**
 * Convert camelCase/PascalCase to kebab-case
 * @internal
 */
export function convertToKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // insert hyphen between consecutive uppercase followed by lowercase
    .toLowerCase()
    .replace(/^-/, ""); // remove leading hyphen if it exists
}
