import { ThemeConfig } from ".";

 export const PREFIX_MAP: Record<keyof ThemeConfig, string> = {
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
    breakpoint: "breakpoint",
    opacity: "opacity",
  };