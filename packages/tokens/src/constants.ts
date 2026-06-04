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
