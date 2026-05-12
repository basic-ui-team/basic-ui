import { ThemeConfig } from ".";

/**
 * Inject a theme configuration into CSS custom properties.
 * Call this once at app root to apply theme overrides globally.
 *
 * @example
 * const myTheme: ThemeConfig = {
 *   colors: {
 *     primary: "#0066cc",
 *     "primary-hover": "#0052a3",
 *   },
 *   spacing: {
 *     md: "1.25rem",
 *   },
 * };
 * createTheme(myTheme);
 */
export function createTheme(config: ThemeConfig): void {
  const root = document.documentElement;

  // Map config property names to their CSS variable prefixes
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

  Object.entries(config).forEach(([category, values]) => {
    if (values) {
      const prefix = prefixMap[category] || convertToKebabCase(category);
      Object.entries(values).forEach(([key, value]) => {
        root.style.setProperty(`--${prefix}-${key}`, String(value));
      });
    }
  });
}

function convertToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
