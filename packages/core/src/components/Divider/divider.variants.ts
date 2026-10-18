import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const dividerThicknessClasses = {
  horizontal: { thin: "border-t-1", medium: "border-t-2", thick: "border-t-4", none: "border-t-0" },
  vertical: { thin: "border-l-1 border-t-0", medium: "border-l-2 border-t-0", thick: "border-l-4 border-t-0", none: "border-l-0 border-t-0" },
} as const;

export const dividerVariants = cva("flex-shrink-0", {
  variants: {
    direction: {
      horizontal: "h-px",
      vertical: "w-px h-full",
    },
    appearance: {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    },
    color: {
      default: "border-border-base",
      muted: "border-border-muted",
      // Sentinel used when a palette-family color applies the recipe variables.
      palette: "",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    color: "default",
    appearance: "solid",
  },
});

export const dividerPaletteRecipe: ColorRecipe = {
  border: { value: "300", dark: { value: "700" } },
};
