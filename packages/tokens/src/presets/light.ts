import type { ThemeConfig } from "../types";

/**
 * Light theme preset
 * Default theme for light mode - used as base for light mode customizations
 */
export const lightTheme: ThemeConfig = {
  color: {
    // ===== PRIMITIVES: PRIMARY RAMP =====
    // Shared hue/saturation so the whole ramp scales together
    "primary-50": "hsl(119 43% 95%)",
    "primary-100": "hsl(119 43% 90%)",
    "primary-200": "hsl(119 43% 80%)",
    "primary-300": "hsl(119 43% 70%)",
    "primary-400": "hsl(119 43% 60%)",
    "primary-500": "hsl(119 43% 52%)", // #50bb4e – brand base
    "primary-600": "hsl(119 43% 45%)",
    "primary-700": "hsl(119 43% 35%)",
    "primary-800": "hsl(119 43% 25%)",
    "primary-900": "hsl(119 43% 15%)",

    // ===== PRIMITIVES: SECONDARY RAMP =====
    // Saturation kept intentionally low (35%) so it complements without competing
    "secondary-50": "hsl(299 35% 95%)",
    "secondary-100": "hsl(299 35% 90%)",
    "secondary-200": "hsl(299 35% 80%)",
    "secondary-300": "hsl(299 35% 70%)",
    "secondary-400": "hsl(299 35% 60%)",
    "secondary-500": "hsl(299 35% 55%)",
    "secondary-600": "hsl(299 35% 45%)",
    "secondary-700": "hsl(299 35% 35%)",

    // ===== PRIMITIVES: ACCENT RAMP =====
    // Used sparingly for accents and feedback, so saturation is moderate (50%)
    "accent-50": "hsl(48 50% 95%)",
    "accent-100": "hsl(48 50% 90%)",
    "accent-200": "hsl(48 50% 80%)",
    "accent-300": "hsl(48 50% 70%)",
    "accent-400": "hsl(48 50% 60%)",
    "accent-500": "hsl(48 50% 50%)",
    "accent-600": "hsl(48 50% 40%)",
    "accent-700": "hsl(48 50% 30%)",
    "accent-800": "hsl(48 50% 20%)",
    "accent-900": "hsl(48 50% 10%)",

    // ===== PRIMITIVES: NEUTRAL GRAY RAMP =====
    // Slight cool tint (210°) avoids flat lifeless grays
    "neutral-50": "hsl(210 20% 97%)",
    "neutral-100": "hsl(210 20% 95%)",
    "neutral-200": "hsl(210 16% 90%)",
    "neutral-300": "hsl(210 12% 84%)",
    "neutral-400": "hsl(210 11% 68%)",
    "neutral-500": "hsl(210 10% 52%)",
    "neutral-600": "hsl(210 10% 42%)",
    "neutral-700": "hsl(210 10% 32%)",
    "neutral-800": "hsl(210 12% 18%)",
    "neutral-900": "hsl(210 18% 8%)",

    // ===== SEMANTIC: LIGHT MODE BACKGROUNDS & SURFACES =====
    "background-primary": "var(--color-neutral-50)",
    "background-secondary": "var(--color-neutral-100)",
    "background-muted": "var(--color-neutral-100)",
    "surface": "var(--color-neutral-50)",
    "surface-hover": "var(--color-neutral-50)",
    "surface-active": "var(--color-neutral-100)",


    // ===== SEMANTIC: TEXT =====
    "foreground-primary": "var(--color-neutral-900)", // gray-900
    "foreground-secondary": "var(--color-neutral-700)", // gray-700
    "foreground-muted": "var(--color-neutral-500)", // gray-500
    "foreground-link": "var(--color-primary-700)", // green-700

    // ===== SEMANTIC: BORDERS =====
    "border-base": "var(--color-neutral-200)", // gray-200
    "border-muted": "var(--color-neutral-100)", // gray-100

    // ===== SEMANTIC: FEEDBACK COLORS =====
    "success": "var(--color-green-500)", // green-500
    "success-light": "var(--color-green-300)", // green-300
    "warning": "var(--color-yellow-500)", // yellow-500
    "warning-light": "var(--color-yellow-300)", // yellow-300
    "error": "var(--color-red-500)", // red-500
    "error-light": "var(--color-red-300)", // red-300
    "info": "var(--color-blue-500)", // blue-500
    "info-light": "var(--color-blue-300)", // blue-300

    // ===== SEMANTIC: SKELETON =====
    "skeleton": "var(--color-neutral-200)", // gray-200
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
  shadow: {
    s1: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    s2: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.1)",
    s3: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)",
    s4: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1)",
    s5: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 25px 50px -12px rgb(0 0 0 / 0.25)",
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
  // TODO: Container queries are a relatively new css feature and we will support them soon.
  // container: {
  //   sm:
  // },
  breakpoint: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  opacity: {
    disabled: 0.5,
    muted: 0.7,
  },
};
