import { cva } from "class-variance-authority";

export const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-current",
  {
    variants: {
      size: {
        // For each size, the border width is proportional to create a consistent visual appearance
        // Border width should be ~1/6 to 1/8 of the diameter to show spinning motion while maintaining circle shape
        xs: "h-3 w-3 border-2",
        sm: "h-4 w-4 border-3",
        md: "h-5 w-5 border-4",
        lg: "h-6 w-6 border-5",
        xl: "w-7 h-7 border-6",
      },
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
  },
);
