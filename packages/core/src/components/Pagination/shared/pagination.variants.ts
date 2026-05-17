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
    "text-foreground-primary disabled:text-foreground-muted",
    "focus-visible:ring-neutral-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        outlined: [
          "border border-foreground-muted",
        ].join(" "),
      },
      size: {
        sm: "p-xs text-sm min-w-[2rem] min-h-[2rem]",
        md: "p-sm text-md min-w-[2.5rem] min-h-[2.5rem]",
        lg: "p-md text-lg min-w-[3rem] min-h-[3rem]",
      },
      shape: {
        rounded: "rounded-md",
        square: "rounded-none",
        circular: "rounded-full",
      },
      color: {
        default: "bg-neutral-200/10 hover:bg-neutral-300 active:bg-neutral-400",
        primary: "bg-primary-500/10 hover:bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary-500/10 hover:bg-secondary-600 active:bg-secondary-700",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "default",
        active: true,
        className: "bg-neutral-400/60 hover:bg-neutral-400",
      },
      {
        color: "primary",
        active: true,
        className: "bg-primary-500/60 hover:bg-primary-300",
      },
      {
        color: "secondary",
        active: true,
        className: "bg-secondary-500/60 hover:bg-secondary-300",
      },
      {
        variant: "outlined",
        color: "default",
        className: "border-neutral-400/50",
      },
      {
        variant: "outlined",
        color: "primary",
        className: "border-primary-500/50",
      },
      {
        variant: "outlined",
        color: "secondary",
        className: "border-secondary-500/50",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded",
      color: "default",
      active: false,
    },
  },
);

export const paginationEllipsisVariants = cva(
  ["flex items-center justify-center", "text-foreground-primary", "px-xs"].join(" "),
);
