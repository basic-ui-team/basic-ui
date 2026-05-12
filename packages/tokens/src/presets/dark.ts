import type { ThemeConfig } from "../types";
import { lightTheme } from "./light";

/**
 * Dark theme preset
 * Overrides for dark mode with adjusted colors and backgrounds
 * References primitive color ramps for consistency
 */
export const darkTheme: ThemeConfig = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,

    // ===== SEMANTIC: DARK MODE BACKGROUNDS & SURFACES =====
    bg: "hsl(210 18% 8%)", // gray-900
    surface: "hsl(210 15% 12%)",
    "surface-hover": "hsl(210 15% 16%)",
    "surface-active": "hsl(210 15% 20%)",
    "muted-bg": "hsl(210 12% 18%)", // gray-800
    "secondary-bg": "hsl(210 12% 18%)", // gray-800

    // ===== SEMANTIC: PRIMARY & SECONDARY (LIGHTENED FOR CONTRAST) =====
    primary: "hsl(119 43% 60%)", // green-400
    "primary-hover": "hsl(119 43% 70%)", // green-300
    "primary-active": "hsl(119 43% 52%)", // green-500
    "primary-light": "hsl(119 43% 15%)", // green-900
    "primary-foreground": "hsl(210 18% 12%)",
    secondary: "hsl(299 35% 70%)", // purple-300
    "secondary-hover": "hsl(299 35% 80%)", // purple-200
    "secondary-active": "hsl(299 35% 90%)", // purple-100
    "secondary-light": "hsl(299 35% 35%)", // purple-700
    "secondary-foreground": "hsl(210 18% 12%)",

    // ===== SEMANTIC: TEXT =====
    text: "hsl(210 20% 95%)", // gray-100
    "text-secondary": "hsl(210 12% 84%)", // gray-300
    "text-muted": "hsl(210 11% 68%)", // gray-400
    "text-light": "hsl(210 18% 8%)", // gray-900
    "text-dark": "hsl(210 20% 97%)", // gray-50
    "text-link": "hsl(119 43% 15%)", // green-900
    "text-feedback": "hsl(210 18% 90%)",

    // ===== SEMANTIC: BORDERS =====
    border: "hsl(210 10% 32%)", // gray-700
    "border-muted": "hsl(210 12% 18%)", // gray-800

    // ===== SEMANTIC: FEEDBACK COLORS =====
    success: "hsl(119 43% 60%)", // green-400
    "success-light": "hsl(119 43% 15%)", // green-900
    "success-foreground": "hsl(210 18% 90%)",
    warning: "hsl(45 90% 65%)",
    "warning-light": "hsl(45 80% 15%)",
    "warning-foreground": "hsl(210 18% 12%)",
    error: "hsl(0 84% 70%)",
    "error-light": "hsl(0 78% 22%)",
    "error-foreground": "hsl(210 18% 90%)",
    info: "hsl(210 88% 66%)",
    "info-light": "hsl(210 90% 20%)",
    "info-foreground": "hsl(210 18% 90%)",

    // ===== SEMANTIC: SKELETON =====
    skeleton: "hsl(210 10% 32%)", // gray-700
  },

  // ===== DARK MODE SHADOWS =====
  // Layered light shadows on dark surfaces for visibility
  shadows: {
    sm: "0 1px 2px 0 hsl(0 0% 100% / 0.1)",
    md: "0 1px 2px 0 hsl(0 0% 100% / 0.08), 0 4px 6px -1px hsl(0 0% 100% / 0.12)",
    lg: "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.1), 0 10px 15px -3px hsl(0 0% 100% / 0.12)",
    xl: "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.05), 0 10px 15px -3px hsl(0 0% 100% / 0.12), 0 20px 25px -5px hsl(0 0% 100% / 0.12)",
    "2xl":
      "0 1px 3px 0 hsl(0 0% 100% / 0.1), 0 4px 6px -2px hsl(0 0% 100% / 0.05), 0 10px 15px -3px hsl(0 0% 100% / 0.12), 0 20px 25px -5px hsl(0 0% 100% / 0.12), 0 25px 50px -12px hsl(0 0% 100% / 0.15)",
  },
};
