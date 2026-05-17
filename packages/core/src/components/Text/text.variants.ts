import { cva } from "class-variance-authority";

export const textVariants = cva("font-sans", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      inherit: "text-inherit",
      default: "text-foreground-primary",
      muted: "text-foreground-muted",
      primary: "text-primary-500",
      secondary: "text-secondary-500",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
      string: "",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    color: "inherit",
    align: "left",
    truncate: false,
  },
});
