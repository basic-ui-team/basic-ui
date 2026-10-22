import type { ThemeConfig } from ".";

export const PREFIX_MAP: Record<keyof ThemeConfig, string> = {
  color: "color",
  radius: "radius",
  shadow: "shadow",
  fontSize: "text",
  fontWeight: "font-weight",
  lineHeight: "leading",
  letterSpacing: "tracking",
  fontFamily: "font",
  duration: "duration",
  easing: "ease",
  zIndex: "z-index",
  breakpoint: "breakpoint",
  // container: "container",
  opacity: "opacity",
};
