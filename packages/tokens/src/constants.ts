import type { ThemeConfig } from ".";

export const PREFIX_MAP: Record<keyof ThemeConfig, string> = {
  color: "color",
  spacing: "spacing",
  radius: "radius",
  shadow: "shadow",
  fontSize: "text",
  fontWeight: "font-weight",
  lineHeight: "leading",
  letterSpacing: "tracking",
  fontFamily: "font",
  duration: "duration",
  easing: "ease",
  zIndex: "z",
  breakpoint: "breakpoint",
  // container: "container",
  opacity: "opacity",
};

export const TAILWIND_COLORS: Record<string, string> = {
  "--color-blue-50": "oklch(97% 0.014 254.604)",
  "--color-blue-100": "oklch(93.2% 0.032 255.585)",
  "--color-blue-400": "oklch(70.7% 0.165 254.624)",
  "--color-blue-500": "oklch(62.3% 0.214 259.815)",
  "--color-blue-900": "oklch(37.9% 0.146 265.522)",

  "--color-green-50": "oklch(98.2% 0.018 155.826)",
  "--color-green-100": "oklch(96.2% 0.044 156.743)",
  "--color-green-400": "oklch(79.2% 0.209 151.711)",
  "--color-green-500": "oklch(72.3% 0.219 149.579)",
  "--color-green-900": "oklch(39.3% 0.095 152.535)",

  "--color-red-50": "oklch(97.1% 0.013 17.38)",
  "--color-red-100": "oklch(93.6% 0.032 17.717)",
  "--color-red-400": "oklch(70.4% 0.191 22.216)",
  "--color-red-500": "oklch(63.7% 0.237 25.331)",
  "--color-red-900": "oklch(39.6% 0.141 25.723)",
};
