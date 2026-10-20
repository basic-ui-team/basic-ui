import { cva } from "class-variance-authority";
import type { ColorRecipe } from "../../lib/colorRecipes/colorRecipes";

export const toggleSizeClasses = {
  sm: "h-[16px] w-[32px] p-[2px]",
  md: "h-[20px] w-[36px] p-[2px]",
  lg: "h-[24px] w-[44px] p-[2px]",
};

export const toggleThumbGeometryVariants = cva("", {
  variants: {
    size: {
      sm: "h-[12px] w-[12px]",
      md: "h-[14px] w-[14px]",
      lg: "h-[16px] w-[16px]",
    },
    checked: {
      true: "",
      false: "translate-x-0",
    },
  },
  compoundVariants: [
    { size: "sm", checked: true, className: "translate-x-[16px]" },
    { size: "md", checked: true, className: "translate-x-[18px]" },
    { size: "lg", checked: true, className: "translate-x-[24px]" },
  ],
});

export const toggleVariants = cva(
  [
    "relative inline-flex items-center shrink-0 rounded-full",
    "transition-colors duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-bg-base",
    "focus-visible:ring-(--cr-bg-focus) dark:focus-visible:ring-(--cr-bg-focus-dark)",
    "[&_[data-slot=thumb]]:block [&_[data-slot=thumb]]:rounded-full [&_[data-slot=thumb]]:shadow-sm [&_[data-slot=thumb]]:transition-transform [&_[data-slot=thumb]]:duration-fast",
  ].join(" "),
  {
    variants: {
      checked: {
        true: "",
        false: "bg-gray-300 dark:bg-gray-700 hover:bg-bg-active",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        checked: false,
        className: "[&_[data-slot=thumb]]:bg-gray-50 dark:[&_[data-slot=thumb]]:bg-gray-50",
      },
      { checked: true, className: "[&_[data-slot=thumb]]:bg-white" },
    ],
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);

export const toggleCheckedRecipe: ColorRecipe = {
  bg: { value: "600", hover: { value: "700" }, dark: { value: "500", hover: { value: "600" } } },
};
