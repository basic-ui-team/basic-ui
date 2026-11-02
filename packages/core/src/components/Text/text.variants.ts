import { cva } from "class-variance-authority";
import { textWrapClasses } from "../../lib";

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
      default: "text-foreground",
      muted: "text-muted-foreground",
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
