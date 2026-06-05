import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "absolute inline-flex items-center justify-center",
    "transform font-semibold rounded-full",
    "transition-all duration-200 ease-spring",
    "pointer-events-none",
    "data-[visible=false]:hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        dot: "w-2 h-2 p-0",
        standard: "",
      },
      size: {
        small: "text-xs min-w-4 w-auto h-4",
        medium: "text-sm min-w-6  w-auto h-6",
        large: "text-base min-w-8 w-auto h-8",
      },
      shape: {
        circular: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
      },
      color: {
        default: "bg-surface-base text-fg-base",
        muted: "bg-bg-muted text-fg-muted",
        primary: "bg-primary-500 text-fg-base",
        secondary: "bg-secondary-500 text-fg-base",
        success: "bg-bg-success text-fg-success",
        warning: "bg-bg-warning text-fg-warning",
        error: "bg-bg-error text-fg-error",
        info: "bg-bg-info text-fg-info",
      },
      position: {
        "top-left": "top-0 left-0 translate-x-[-50%] translate-y-[-50%]",
        "top-right": "top-0 right-0 translate-x-[50%] translate-y-[-50%]",
        "bottom-left": "bottom-0 left-0 translate-x-[-50%] translate-y-[50%]",
        "bottom-right": "bottom-0 right-0 translate-x-[50%] translate-y-[50%]",
      },
      ping: {
        true: "motion-safe:animate-[ping_1.5s_ease-out_infinite]",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "dot",
        size: "small",
        className: "w-2 h-2 min-w-2 min-h-2 px-0 py-0",
      },
      {
        variant: "dot",
        size: "medium",
        className: "w-3 h-3 min-w-3 min-h-3 px-0 py-0",
      },
      {
        variant: "dot",
        size: "large",
        className: "w-4 h-4 min-w-4 min-h-4 px-0 py-0",
      },
    ],
    defaultVariants: {
      variant: "standard",
      size: "medium",
      color: "info",
      shape: "circular",
      position: "top-right",
      ping: false,
    },
  },
);
