import { cva } from "class-variance-authority";

export const iconVariants = cva("", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    },
    variant: {
      default: "text-primary",
      muted: "text-muted",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
      info: "text-info",
    },
    color: {
      default: "",
      light: "text-light",
      dark: "text-dark",
    },
  },
  defaultVariants: { size: "md", variant: "default", color: "default" },
});
