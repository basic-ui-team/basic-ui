import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const spinnerSizeClasses = {
  xs: "h-4 w-4 border-1",
  sm: "h-5 w-5 border-2",
  md: "h-6 w-6 border-3",
  lg: "h-7 w-7 border-4",
  xl: "w-8 h-8 border-5",
} as const;

export const spinnerVariants = cva(
  "animate-spin rounded-full border-solid",
  {
    variants: {
      size: spinnerSizeClasses,
      color: {
        default: "border-border-base border-t-transparent",
        muted: "border-border-muted border-t-transparent",
        // Sentinel used when a palette-family color applies the recipe variables.
        // Colors only the x/b sides so no all-sides utility can compete with
        // the transparent top segment, in either theme.
        palette:
          "border-x-(--cr-border) border-b-(--cr-border) border-t-transparent dark:border-x-(--cr-border-dark) dark:border-b-(--cr-border-dark)",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  },
);

export const spinnerPaletteRecipe: ColorRecipe = {
  border: { value: "500", dark: { value: "400" } },
};
