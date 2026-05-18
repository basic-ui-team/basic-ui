import { cva } from "class-variance-authority";

export const textVariants = cva("font-sans", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-foreground-primary",
      muted: "text-foreground-muted",
      primary: "text-primary-700 dark:text-primary-300",
      secondary: "text-secondary-700 dark:text-secondary-300",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
      custom: "",
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
    wrap: {
      nowrap: "text-nowrap",
      wrap: "text-wrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    align: "left",
    truncate: false,
    wrap: "nowrap",
  },
});
