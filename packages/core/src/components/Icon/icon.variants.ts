import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const iconSizeClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
  xl: "w-8 h-8",
} as const;

export const iconVariants = cva("flex items-center justify-center", {
  variants: {
    size: iconSizeClasses,
    color: {
      muted: "text-fg-muted",
      // Sentinel used when a palette-family color applies the recipe variables.
      palette: "",
    },
  },
  defaultVariants: { size: "md" },
});

export const iconPaletteRecipe: ColorRecipe = {
  text: { value: "600", dark: { value: "400" } },
};
