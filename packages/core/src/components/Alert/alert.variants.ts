import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const alertVariants = cva("flex gap-3 rounded-lg p-3 items-center", {
  variants: {
    variant: {
      subtle: "",
      filled: "",
      outline: "border-2",
    },
  },
  defaultVariants: {
    variant: "subtle",
  },
});

export const alertTitleVariants = cva("font-semibold text-sm");

export const alertContentVariants = cva("flex-1 text-sm");

export const alertActionVariants = cva("ml-auto flex items-center gap-2");

export const alertDismissButtonVariants = cva(
  "shrink-0 -mr-2 -my-2 rounded p-2 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
);

export const alertPaletteRecipe: Record<"subtle" | "outline" | "filled", ColorRecipe> = {
  subtle: {
    bg: { value: "100", opacity: 30, dark: { value: "800", opacity: 30 } },
    text: { value: "800", dark: { value: "200" } },
  },
  outline: {
    text: { value: "800", dark: { value: "200" } },
    border: { value: "300", dark: { value: "700" } },
  },
  filled: {
    bg: { value: "200", dark: { value: "700" } },
    text: { value: "black", dark: { value: "white" } },
  },
};
