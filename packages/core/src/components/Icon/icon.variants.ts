import { cva } from "class-variance-authority";

export const iconVariants = cva("", {
  variants: {
    size: {
      xs: "w-md h-md",
      sm: "w-lg h-lg",
      md: "w-xl h-xl",
      lg: "w-2xl h-2xl",
      xl: "w-3xl h-3xl",
      xxl: "w-4xl h-4xl",
      xxxl: "w-5xl h-5xl",
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
