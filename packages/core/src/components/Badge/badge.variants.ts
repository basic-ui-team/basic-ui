import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const badgeVariants = cva(
  ["absolute inline-flex items-center justify-center", "z-elevated pointer-events-none"].join(" "),
  {
    variants: {
      variant: {
        count: "rounded-full font-semibold text-sm text-center leading-none whitespace-nowrap px-2 pt-0.5 pb-1 min-h-6 min-w-6",
        dot: "rounded-full h-3 w-3",
      },
      position: {
        "top-left": "top-0 left-0 translate-x-[-50%] translate-y-[-50%]",
        "top-right": "top-0 right-0 translate-x-[50%] translate-y-[-50%]",
        "bottom-left": "bottom-0 left-0 translate-x-[-50%] translate-y-[50%]",
        "bottom-right": "bottom-0 right-0 translate-x-[50%] translate-y-[50%]",
      },
    },
    defaultVariants: {
      variant: "count",
      position: "top-right",
    },
  },
);

export const badgePaletteRecipe: ColorRecipe = {
  bg: { value: "200", dark: { value: "700" } },
  text: { value: "black", dark: { value: "white" } },
};
