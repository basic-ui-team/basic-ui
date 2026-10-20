import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../../lib/colorRecipes/colorRecipes";

export const paginationVariants = cva(
  ["flex items-center justify-center gap-2", "flex-wrap"].join(" "),
);

export const paginationButtonVariants = cva(
  [
    "inline-flex items-center justify-center font-medium",
    "transition-colors duration-normal ease-out",
    "focus-visible:outline-none focus-visible:ring-2 ring-offset-bg-base focus-visible:ring-offset-2",
    "focus-visible:ring-(--cr-bg-focus) dark:focus-visible:ring-(--cr-bg-focus-dark)",
    "disabled:opacity-disabled disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        outlined: "border",
      },
      size: {
        sm: "p-1 text-sm min-w-[2rem] min-h-[2rem]",
        md: "p-2 text-md min-w-[2.5rem] min-h-[2.5rem]",
        lg: "p-3 text-lg min-w-[3rem] min-h-[3rem]",
      },
      shape: {
        rounded: "rounded-md",
        square: "rounded-none",
        circular: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded",
    },
  },
);

export const paginationButtonPaletteRecipes: Record<"default" | "active", ColorRecipe> = {
  default: {
    bg: {
      value: "100",
      opacity: 30,
      hover: { value: "100", opacity: 60 },
      active: { value: "100", opacity: 85 },
      focus: { value: "500" },
      dark: {
        value: "300",
        opacity: 30,
        hover: { value: "300", opacity: 50 },
        active: { value: "300", opacity: 85 },
        focus: { value: "400" },
      },
    },
    text: { value: "800", dark: { value: "200" } },
    border: { value: "300", dark: { value: "700" } },
  },
  active: {
    bg: {
      value: "600",
      hover: { value: "700" },
      dark: { value: "500", hover: { value: "600" } },
    },
    text: { value: "white" },
    border: { value: "600" },
  },
};

export const paginationEllipsisVariants = cva(
  ["flex items-center justify-center", "text-fg-base", "px-1"].join(" "),
);
