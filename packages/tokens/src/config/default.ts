import type { ThemeConfig } from "../";

/** Default theme configuration with sensible values for all tokens. */
export const defaultTheme: ThemeConfig = {
  /* ===== COLORS ===== */
  colors: {
    // Backgrounds & Surfaces
    bg: "hsl(210 20% 97%)",
    surface: "hsl(210 20% 100%)",
    "surface-hover": "hsl(210 20% 97%)",
    "surface-active": "hsl(210 20% 95%)",
    "muted-bg": "hsl(210 20% 95%)",
    "secondary-bg": "hsl(210 20% 95%)",

    // Primary (Green)
    foreground: "hsl(210 18% 12%)",
    primary: "hsl(119 43% 52%)", // #50bb4e
    "primary-hover": "hsl(119 43% 45%)",
    "primary-active": "hsl(119 43% 35%)",
    "primary-light": "hsl(119 43% 95%)",
    "primary-foreground": "hsl(210 18% 12%)",

    // Secondary (Purple)
    secondary: "hsl(299 35% 55%)",
    "secondary-hover": "hsl(299 35% 45%)",
    "secondary-active": "hsl(299 35% 35%)",
    "secondary-light": "hsl(299 35% 95%)",
    "secondary-foreground": "hsl(210 18% 12%)",

    // Text
    text: "hsl(210 10% 18%)",
    "text-secondary": "hsl(210 10% 42%)",
    "text-light": "hsl(210 10% 52%)",
    "text-dark": "hsl(210 18% 8%)",
    "text-link": "hsl(119 43% 35%)",
    "text-feedback":
      "hsl(210 18% 12%)" /* for text on feedback colors (success, warning, error, info) */,

    // Borders
    border: "hsl(210 16% 90%)",
    "border-muted": "hsl(210 20% 95%)",

    // Feedback (Semantic)
    success: "hsl(119 43% 52%)",
    "success-light": "hsl(119 43% 90%)",
    warning: "hsl(45 93% 56%)",
    "warning-light": "hsl(45 93% 90%)",
    error: "hsl(0 84% 60%)",
    "error-light": "hsl(0 100% 95%)",
    info: "hsl(210 88% 56%)",
    "info-light": "hsl(210 100% 95%)",

    // Skeleton & Loading
    skeleton: "hsl(210 20% 90%)",
  },

  /* ===== SPACING ===== */
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
    "5xl": "8rem", // 128px
  },

  /* ===== BORDER RADIUS ===== */
  radius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  /* ===== SHADOWS ===== */
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "2xl":
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  /* ===== TYPOGRAPHY ===== */
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.75rem", // 28px
    "3xl": "2.25rem", // 36px
    "4xl": "3rem", // 48px
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

  /* ===== MOTION ===== */
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

  /* ===== ELEVATION (Z-INDEX) ===== */
  zIndex: {
    dropdown: 40,
    modal: 45,
    toast: 50,
    tooltip: 50,
  },

  /* ===== CONTAINER QUERIES ===== */
  container: {
    sm: "28rem", // 448px
    md: "42rem", // 672px
    lg: "64rem", // 1024px
    xl: "80rem", // 1280px
    max: "96rem", // 1536px
  },

  /* ===== OPACITY ===== */
  opacity: {
    disabled: 0.5,
    muted: 0.7,
  },
};
