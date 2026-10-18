import { cva } from "class-variance-authority";

export const spinnerSizeClasses = {
  xs: "h-4 w-4 border-1",
  sm: "h-5 w-5 border-2",
  md: "h-6 w-6 border-3",
  lg: "h-7 w-7 border-4",
  xl: "w-8 h-8 border-5",
} as const;

export const spinnerVariants = cva("animate-spin rounded-full border-solid border-current", {
  variants: {
    size: spinnerSizeClasses,
    color: {
      default: "border-border-base border-t-transparent",
      muted: "border-border-muted border-t-transparent",
      primary: "border-primary-500 border-t-transparent",
      secondary: "border-secondary-500 border-t-transparent",
      success: "border-border-success border-t-transparent",
      error: "border-border-error border-t-transparent",
      warning: "border-border-warning border-t-transparent",
      info: "border-border-info border-t-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});
