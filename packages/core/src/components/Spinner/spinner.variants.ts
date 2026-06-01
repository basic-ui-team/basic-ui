import { cva } from "class-variance-authority";

export const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-current",
  {
    variants: {
      size: {
        // For each size, the border width is proportional to create a consistent visual appearance
        // Border width should be ~1/6 to 1/8 of the diameter to show spinning motion while maintaining circle shape
        xs: "h-md w-md border-2",
        sm: "h-lg w-lg border-3",
        md: "h-xl w-xl border-4",
        lg: "h-2xl w-2xl border-5",
        xl: "w-3xl h-3xl border-6",
      },
      color: {
        default: "border-border-base border-t-transparent",
        muted: "border-border-muted border-t-transparent",
        primary: "border-primary-500 border-t-transparent",
        secondary: "border-secondary-500 border-t-transparent",
        success: "border-success border-t-transparent",
        error: "border-error border-t-transparent",
        warning: "border-warning border-t-transparent",
        info: "border-info border-t-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  },
);
