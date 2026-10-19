import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const badgeGeometryVariants = cva("", {
  variants: {
    size: { sm: "", md: "", lg: "" },
    variant: { count: "", dot: "" },
  },
  compoundVariants: [
    { variant: "count", size: "sm", className: "min-h-5 min-w-5 px-2 text-xs" },
    { variant: "count", size: "md", className: "min-h-6 min-w-6 px-2 text-sm" },
    { variant: "count", size: "lg", className: "min-h-7 min-w-7 px-3 text-sm" },
    { variant: "dot", size: "sm", className: "h-2 w-2" },
    { variant: "dot", size: "md", className: "h-3 w-3" },
    { variant: "dot", size: "lg", className: "h-4 w-4" },
  ],
});

export const badgeVariants = cva(
  ["absolute inline-flex items-center justify-center", "z-elevated pointer-events-none"].join(" "),
  {
    variants: {
      variant: {
        count: "rounded-full font-semibold leading-none whitespace-nowrap",
        dot: "rounded-full",
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
