import ThemeConfig from "../types/index";
import { lightTheme, darkTheme } from "../themes";
import { themeToCSSVariables } from "./themeToCSSVariables";
import { mergeTheme } from "./mergeTheme";

/**
 * Theme configuration for light and dark modes.
 * Both are optional - if not provided, CSS defaults will be used.
 */
export interface ThemeInput {
  light?: Partial<ThemeConfig>;
  dark?: Partial<ThemeConfig>;
}

/**
 * Inject theme configuration into CSS custom properties.
 * Supports separate light and dark themes to work with class-based dark mode.
 *
 * @example
 * // Minimal: just brand colors
 * createTheme({
 *   light: { colors: { primary: "#0066cc" } },
 *   dark: { colors: { primary: "#4D94FF" } },
 * });
 *
 * // Full customization
 * createTheme({
 *   light: { colors: {...}, spacing: {...} },
 *   dark: { colors: {...}, spacing: {...} },
 * });
 */
export function createTheme(config: ThemeInput): void {
  if (typeof document === "undefined") {
    console.warn("createTheme() can only be used in a browser environment.");
    return;
  }
  const root = document.documentElement;

  // Helper to inject theme to a target element
  const injectTheme = (theme: ThemeConfig, target: HTMLElement = root) => {
    const props = themeToCSSVariables(theme).customProperties;
    Object.entries(props).forEach(([varName, value]) => {
      target.style.setProperty(varName, String(value));
    });
  };

  // Inject light theme to :root
  if (config.light) {
    const mergedLight = mergeTheme(lightTheme, config.light);
    injectTheme(mergedLight, root);
  }

  // Inject dark theme via CSS :root.dark selector
  if (config.dark) {
    const mergedDark = mergeTheme(darkTheme, config.dark);
    injectDarkThemeStyles(mergedDark);
  }
}

/**
 * Helper: Create a style element that targets :root.dark
 * This ensures dark theme doesn't get overridden by light theme inline styles
 */
function injectDarkThemeStyles(theme: ThemeConfig): void {
  // Remove existing dark theme style if present
  const existingStyle = document.getElementById("simple-ui-dark-theme");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create CSS rules for :root.dark
  const props = themeToCSSVariables(theme).customProperties;
  let darkCSS = ":root.dark {\n";
  Object.entries(props).forEach(([varName, value]) => {
    darkCSS += `  ${varName}: ${String(value)};\n`;
  });
  darkCSS += "}";

  // Inject as style element
  const style = document.createElement("style");
  style.id = "simple-ui-dark-theme";
  style.textContent = darkCSS;
  document.head.appendChild(style);
}
