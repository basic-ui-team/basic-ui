import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const buttonSizeClasses = {
  sm: "px-2 py-1 text-sm gap-1 rounded-md",
  md: "px-4 py-2 text-md gap-2 rounded-lg",
  lg: "px-6 py-3 text-lg gap-3 rounded-xl",
} as const;

export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 font-medium select-none",
    "transition-all duration-slow ease-spring",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-bg-base",
    "text-fg-base",
  ].join(" "),
  {
    variants: {
      size: buttonSizeClasses,
      variant: {
        solid: "focus-visible:ring-(--cr-bg-focus) dark:focus-visible:ring-(--cr-bg-focus-dark)",
        ghost: "focus-visible:ring-(--cr-bg-focus) dark:focus-visible:ring-(--cr-bg-focus-dark)",
        outline:
          "border-2 focus-visible:ring-(--cr-border-focus) dark:focus-visible:ring-(--cr-border-focus-dark)",
        link: "cursor-pointer underline focus-visible:ring-(--cr-text-focus) dark:focus-visible:ring-(--cr-text-focus-dark)",
      },
      loading: {
        true: "opacity-70 cursor-progress hover:none active:none",
        false: "",
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed hover:none active:none",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "solid",
      loading: false,
      disabled: false,
    },
  },
);

export const buttonPaletteRecipes: Record<"solid" | "ghost" | "outline" | "link", ColorRecipe> = {
  solid: {
    bg: {
      value: "700",
      hover: { value: "600" },
      active: { value: "800" },
      dark: { value: "700", hover: { value: "500" }, active: { value: "700" } },
    },
    text: { value: "white" },
  },
  ghost: {
    bg: {
      value: "200",
      opacity: 30,
      hover: { value: "200", opacity: 70 },
      active: { value: "200", opacity: 85 },
      focus: { value: "500", opacity: 100 },
      dark: {
        value: "300",
        opacity: 30,
        hover: { value: "300", opacity: 50 },
        active: { value: "300", opacity: 85 },
        focus: { value: "500", opacity: 100 },
      },
    },
    text: { value: "800", dark: { value: "200" } },
  },
  outline: {
    bg: {
      value: "white",
      opacity: 0,
      hover: { value: "50", opacity: 10 },
      active: { value: "700", opacity: 15 },
      dark: {
        value: "white",
        opacity: 0,
        hover: { value: "50", opacity: 70 },
        active: { value: "100" },
        focus: { value: "400", opacity: 100 },
      },
    },
    text: { value: "700", dark: { value: "300" } },
    border: { value: "500" },
  },
  link: {
    text: {
      value: "700",
      hover: { value: "800" },
      dark: { value: "200", hover: { value: "400" } },
    },
  },
};

export default buttonVariants;
