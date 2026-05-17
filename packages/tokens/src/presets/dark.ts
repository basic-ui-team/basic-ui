import type { ThemeConfig } from "../types";
import { lightTheme } from "./light";

/**
 * Dark theme preset
 * Overrides for dark mode with adjusted colors and backgrounds
 * References primitive color ramps for consistency
 */
export const darkTheme: ThemeConfig = {
  ...lightTheme,
  color: {
    ...lightTheme.color,

    // ===== SEMANTIC: DARK MODE BACKGROUNDS & SURFACES =====
    "background-primary": "var(--color-neutral-900)", // gray-900
    "background-secondary": "var(--color-neutral-800)", // gray-800
    "background-muted": "var(--color-neutral-800)", // gray-800
    "surface": "hsl(210 15% 12%)",
    "surface-hover": "hsl(210 15% 16%)",
    "surface-active": "hsl(210 15% 20%)",

    // ===== SEMANTIC: TEXT =====
    "foreground-primary": "var(--color-neutral-100)", // gray-100
    "foreground-secondary": "var(--color-neutral-300)", // gray-300
    "foreground-muted": "var(--color-neutral-400)", // gray-400
    "foreground-link": "var(--color-green-900)", // green-900

    // ===== SEMANTIC: BORDERS =====
    "border-base": "var(--color-neutral-700)", // gray-700
    "border-muted": "var(--color-neutral-800)", // gray-800

    // ===== SEMANTIC: FEEDBACK COLORS =====
    "success": "var(--color-green-400)", // green-400
    "success-light": "var(--color-green-900)", // green-900
    "warning": "var(--color-yellow-400)",
    "warning-light": "var(--color-yellow-900)",
    "error": "var(--color-red-400)",
    "error-light": "var(--color-red-900)",
    "info": "var(--color-blue-400)",
    "info-light": "var(--color-blue-900)",

    // ===== SEMANTIC: SKELETON =====
    "skeleton": "var(--color-neutral-700)", // gray-700
  },

  // ===== DARK MODE SHADOWS =====
  // Layered light shadows on dark surfaces for visibility
  shadow: {
    s1: "0 1px 2px 0 hsl(0 0% 100% / 0.1)",
    s2: "0 1px 2px 0 hsl(0 0% 100% / 0.08), 0 4px 6px -1px hsl(0 0% 100% / 0.12)",
    s3: "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.1), 0 10px 15px -3px hsl(0 0% 100% / 0.12)",
    s4: "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.05), 0 10px 15px -3px hsl(0 0% 100% / 0.12), 0 20px 25px -5px hsl(0 0% 100% / 0.12)",
    s5: "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.05), 0 10px 15px -3px hsl(0 0% 100% / 0.12), 0 20px 25px -5px hsl(0 0% 100% / 0.12), 0 25px 50px -12px hsl(0 0% 100% / 0.15)",
  },
};
