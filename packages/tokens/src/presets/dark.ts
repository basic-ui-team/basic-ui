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
    "color-background-primary": "var(--neutral-900)", // gray-900
    "color-background-secondary": "var(--neutral-800)", // gray-800
    "color-background-muted": "var(--neutral-800)", // gray-800
    "color-surface": "hsl(210 15% 12%)",
    "color-surface-hover": "hsl(210 15% 16%)",
    "color-surface-active": "hsl(210 15% 20%)",

    // ===== SEMANTIC: PRIMARY & SECONDARY (LIGHTENED FOR CONTRAST) =====
    "color-primary": "var(--primary-400)", // green-400
    "color-primary-hover": "var(--primary-300)", // green-300
    "color-primary-active": "var(--primary-500)", // green-500
    "color-primary-light": "var(--primary-900)", // green-900
    "color-secondary": "var(--secondary-300)", // purple-300
    "color-secondary-hover": "var(--secondary-200)", // purple-200
    "color-secondary-active": "var(--secondary-100)", // purple-100
    "color-secondary-light": "var(--secondary-700)", // purple-700

    // ===== SEMANTIC: TEXT =====
    "color-text-primary": "var(--neutral-100)", // gray-100
    "color-text-secondary": "var(--neutral-300)", // gray-300
    "color-text-muted": "var(--neutral-400)", // gray-400
    "color-text-link": "var(--green-900)", // green-900
    "color-text-feedback": "var(--neutral-200)", // gray-200

    // ===== SEMANTIC: BORDERS =====
    "color-border": "var(--neutral-700)", // gray-700
    "color-border-muted": "var(--neutral-800)", // gray-800

    // ===== SEMANTIC: FEEDBACK COLORS =====
    "color-success": "var(--color-green-400)", // green-400
    "color-success-light": "var(--color-green-900)", // green-900
    "color-warning": "var(--color-yellow-400)",
    "color-warning-light": "var(--color-yellow-900)",
    "color-error": "var(--color-red-400)",
    "color-error-light": "var(--color-red-900)",
    "color-info": "var(--color-blue-400)",
    "color-info-light": "var(--color-blue-900)",

    // ===== SEMANTIC: SKELETON =====
    "color-skeleton": "var(--neutral-700)", // gray-700
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
