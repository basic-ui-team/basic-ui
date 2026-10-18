import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";
import { textWrapClasses } from "../../lib";

export const headerSizeClasses = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  h5: "text-md",
  h6: "text-sm",
} as const;

export const headerAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const headerVariants = cva("font-sans font-normal leading-tight", {
  variants: {
    size: headerSizeClasses,
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-fg-base",
      muted: "text-fg-muted",
      palette: "",
    },
    align: headerAlignClasses,
    truncate: {
      true: "truncate",
      false: "",
    },
    wrap: textWrapClasses,
  },
  defaultVariants: {
    size: "h2",
    weight: "normal",
    color: "default",
    align: "left",
    truncate: false,
    wrap: "nowrap",
  },
});

export const headerPaletteRecipe: ColorRecipe = {
  text: { value: "700", dark: { value: "300" } },
};
