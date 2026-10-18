import { cva } from "class-variance-authority";

export const iconSizeClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
  xl: "w-8 h-8",
} as const;

export const iconVariants = cva("flex items-center justify-center", {
  variants: {
    size: iconSizeClasses,
    color: {
      muted: "text-fg-muted",
      success: "text-fg-success",
      error: "text-fg-error",
      warning: "text-fg-warning",
      info: "text-fg-info",
    },
  },
  defaultVariants: { size: "md" },
});
