import { cva } from "class-variance-authority";
import { textWrapClasses } from "@core/lib";

export const textSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
} as const;

export const textAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const textVariants = cva("font-sans", {
  variants: {
    size: textSizeClasses,
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-fg-base",
      muted: "text-fg-muted",
      primary: "text-primary-700 dark:text-primary-300",
      secondary: "text-secondary-700 dark:text-secondary-300",
      error: "text-fg-error",
      success: "text-fg-success",
      warning: "text-fg-warning",
      info: "text-fg-info",
      custom: "",
    },
    align: textAlignClasses,
    truncate: {
      true: "truncate",
      false: "",
    },
    wrap: textWrapClasses,
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    align: "left",
    truncate: false,
    wrap: "wrap",
  },
});
