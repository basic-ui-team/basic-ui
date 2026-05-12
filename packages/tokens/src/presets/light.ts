import type { ThemeConfig } from "../types";

/**
 * Light theme preset
 * Default theme for light mode - used as base for light mode customizations
 */
export const lightTheme: ThemeConfig = {
  colors: {
    // ===== PRIMITIVES: GREEN RAMP =====
    // Shared hue/saturation so the whole ramp scales together
    "green-50": "hsl(119 43% 95%)",
    "green-100": "hsl(119 43% 90%)",
    "green-200": "hsl(119 43% 80%)",
    "green-300": "hsl(119 43% 70%)",
    "green-400": "hsl(119 43% 60%)",
    "green-500": "hsl(119 43% 52%)", // #50bb4e – brand base
    "green-600": "hsl(119 43% 45%)",
    "green-700": "hsl(119 43% 35%)",
    "green-800": "hsl(119 43% 25%)",
    "green-900": "hsl(119 43% 15%)",

    // ===== PRIMITIVES: PURPLE RAMP =====
    // Saturation kept intentionally low (35%) so it complements without competing
    "purple-50": "hsl(299 35% 95%)",
    "purple-100": "hsl(299 35% 90%)",
    "purple-200": "hsl(299 35% 80%)",
    "purple-300": "hsl(299 35% 70%)",
    "purple-400": "hsl(299 35% 60%)",
    "purple-500": "hsl(299 35% 55%)",
    "purple-600": "hsl(299 35% 45%)",
    "purple-700": "hsl(299 35% 35%)",

    // ===== PRIMITIVES: NEUTRAL GRAY RAMP =====
    // Slight cool tint (210°) avoids flat lifeless grays
    "gray-50": "hsl(210 20% 97%)",
    "gray-100": "hsl(210 20% 95%)",
    "gray-200": "hsl(210 16% 90%)",
    "gray-300": "hsl(210 12% 84%)",
    "gray-400": "hsl(210 11% 68%)",
    "gray-500": "hsl(210 10% 52%)",
    "gray-600": "hsl(210 10% 42%)",
    "gray-700": "hsl(210 10% 32%)",
    "gray-800": "hsl(210 12% 18%)",
    "gray-900": "hsl(210 18% 8%)",

    // ===== SEMANTIC: LIGHT MODE BACKGROUNDS & SURFACES =====
    bg: "hsl(210 20% 97%)",
    surface: "hsl(210 20% 100%)",
    "surface-hover": "hsl(210 20% 97%)",
    "surface-active": "hsl(210 20% 95%)",
    "muted-bg": "hsl(210 20% 95%)",
    "secondary-bg": "hsl(210 20% 95%)",

    // ===== SEMANTIC: PRIMARY & SECONDARY =====
    foreground: "hsl(210 18% 12%)",
    primary: "hsl(119 43% 52%)", // green-500
    "primary-hover": "hsl(119 43% 45%)", // green-600
    "primary-active": "hsl(119 43% 35%)", // green-700
    "primary-light": "hsl(119 43% 95%)", // green-50
    "primary-foreground": "hsl(210 18% 12%)",
    secondary: "hsl(299 35% 55%)", // purple-500
    "secondary-hover": "hsl(299 35% 45%)", // purple-600
    "secondary-active": "hsl(299 35% 35%)", // purple-700
    "secondary-light": "hsl(299 35% 95%)", // purple-50
    "secondary-foreground": "hsl(210 18% 12%)",

    // ===== SEMANTIC: TEXT =====
    text: "hsl(210 10% 18%)",
    "text-secondary": "hsl(210 10% 42%)",
    "text-muted": "hsl(210 10% 52%)", // gray-500
    "text-light": "hsl(210 10% 42%)", // gray-600
    "text-dark": "hsl(210 18% 8%)", // gray-900
    "text-link": "hsl(119 43% 35%)", // green-700
    "text-feedback": "hsl(0 84% 35%)",

    // ===== SEMANTIC: BORDERS =====
    border: "hsl(210 16% 90%)", // gray-200
    "border-muted": "hsl(210 20% 95%)", // gray-100

    // ===== SEMANTIC: FEEDBACK COLORS =====
    success: "hsl(119 43% 52%)", // green-500
    "success-light": "hsl(119 43% 95%)", // green-50
    "success-foreground": "hsl(210 18% 12%)",
    warning: "hsl(45 93% 56%)",
    "warning-light": "hsl(45 93% 90%)",
    "warning-foreground": "hsl(210 18% 12%)",
    error: "hsl(0 84% 60%)",
    "error-light": "hsl(0 100% 95%)",
    "error-foreground": "hsl(210 18% 12%)",
    info: "hsl(210 88% 56%)",
    "info-light": "hsl(210 100% 95%)",
    "info-foreground": "hsl(210 18% 12%)",

    // ===== SEMANTIC: SKELETON =====
    skeleton: "hsl(210 16% 90%)", // gray-200
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "5xl": "8rem",
  },
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "2xl":
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.275,
    normal: 1.45,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tight: "-0.04em",
    normal: "0.01em",
    wide: "0.05em",
  },
  fontFamily: {
    sans: 'system-ui, "Segoe UI", Roboto, sans-serif',
    heading: 'system-ui, "Segoe UI", Roboto, sans-serif',
    mono: "ui-monospace, Consolas, monospace",
  },
  duration: {
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
  },
  easing: {
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  zIndex: {
    dropdown: 40,
    modal: 45,
    toast: 50,
    tooltip: 50,
  },
  breakpoint: {
    sm: "28rem",
    md: "42rem",
    lg: "64rem",
    xl: "80rem",
    max: "96rem",
  },
  opacity: {
    disabled: 0.5,
    muted: 0.7,
  },
};
