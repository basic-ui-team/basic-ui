import { ThemeConfig } from "@tokens/types";

/**
 * Deep merge two theme configurations, with the override taking precedence.
 * This is used internally to combine the default theme with user overrides.
 */
export function mergeTheme(base: ThemeConfig, override: Partial<ThemeConfig>): ThemeConfig {
  return {
    color: { ...base.color, ...override.color },
    spacing: { ...base.spacing, ...override.spacing },
    radius: { ...base.radius, ...override.radius },
    shadow: { ...base.shadow, ...override.shadow },
    fontSize: { ...base.fontSize, ...override.fontSize },
    fontWeight: { ...base.fontWeight, ...override.fontWeight },
    lineHeight: { ...base.lineHeight, ...override.lineHeight },
    letterSpacing: { ...base.letterSpacing, ...override.letterSpacing },
    fontFamily: { ...base.fontFamily, ...override.fontFamily },
    duration: { ...base.duration, ...override.duration },
    easing: { ...base.easing, ...override.easing },
    zIndex: { ...base.zIndex, ...override.zIndex },
    // container: { ...base.container, ...override.container },
    breakpoint: { ...base.breakpoint, ...override.breakpoint },
    opacity: { ...base.opacity, ...override.opacity },
  };
}
