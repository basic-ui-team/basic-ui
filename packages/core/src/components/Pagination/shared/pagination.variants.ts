import { cva } from "class-variance-authority";

export const paginationVariants = cva(
  ["flex items-center justify-center gap-2", "flex-wrap"].join(" "),
);

export const paginationButtonVariants = cva(
  [
    "inline-flex items-center justify-center font-medium",
    "transition-colors duration-normal ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2",
    "disabled:opacity-disabled disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        outlined: "border border-input",
      },
      active: {
        true: "bg-primary text-primary-foreground hover:bg-primary-hover cursor-default",
        false: "text-foreground hover:bg-muted-hover",
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
      active: false,
      size: "md",
      shape: "rounded",
    },
  },
);

export const paginationEllipsisVariants = cva(
  ["flex items-center justify-center", "text-foreground", "px-1"].join(" "),
);
