import type { ThemeConfig } from "../types";
import { lightTheme } from "./light";

/**
 * Dark theme preset
 * Overrides for dark mode with adjusted colors and backgrounds
 */
export const darkTheme: ThemeConfig = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Dark mode backgrounds & surfaces
    bg: "hsl(210 10% 8%)",
    surface: "hsl(210 15% 12%)",
    "surface-hover": "hsl(210 15% 16%)",
    "surface-active": "hsl(210 15% 20%)",
    "muted-bg": "hsl(210 10% 18%)",
    "secondary-bg": "hsl(210 10% 18%)",
    // Dark mode text
    text: "hsl(210 20% 95%)",
    "text-secondary": "hsl(210 12% 84%)",
    "text-light": "hsl(210 10% 68%)",
    "text-dark": "hsl(210 16% 90%)",
    // Dark mode borders
    border: "hsl(210 10% 32%)",
    "border-muted": "hsl(210 10% 18%)",
    // Dark mode primary/secondary (lightened for contrast)
    primary: "hsl(119 43% 60%)",
    "primary-hover": "hsl(119 43% 70%)",
    "primary-active": "hsl(119 43% 52%)",
    "primary-light": "hsl(119 43% 15%)",
    secondary: "hsl(299 35% 70%)",
    "secondary-hover": "hsl(299 35% 80%)",
    "secondary-active": "hsl(299 35% 55%)",
    "secondary-light": "hsl(299 35% 15%)",
    // Dark mode skeleton
    skeleton: "hsl(210 10% 32%)",
  },
};
