import { cva } from "class-variance-authority";

export const paginationVariants = cva(
  ["flex items-center justify-center gap-sm", "flex-wrap"].join(" "),
);

export const paginationButtonVariants = cva(
  [
    "inline-flex items-center justify-center font-medium",
    "transition-colors duration-normal ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
    "disabled:opacity-disabled disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-default hover:bg-surface active:bg-surface-active",
          "text-primary",
          "border border-base",
          "focus-visible:ring-primary",
        ].join(" "),
        active: [
          "bg-primary hover:bg-primary active:bg-primary",
          "text-primary-foreground",
          "border border-primary",
          "focus-visible:ring-primary",
        ].join(" "),
      },
      size: {
        sm: "px-xs py-xs text-xs min-w-[2rem] min-h-[2rem]",
        md: "px-sm py-sm text-sm min-w-[2.5rem] min-h-[2.5rem]",
        lg: "px-md py-md text-base min-w-[3rem] min-h-[3rem]",
      },
      shape: {
        rounded: "rounded-md",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded",
    },
  },
);

export const paginationEllipsisVariants = cva(
  ["flex items-center justify-center", "text-primary", "px-xs"].join(" "),
);
