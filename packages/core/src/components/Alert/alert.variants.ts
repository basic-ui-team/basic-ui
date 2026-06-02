import { cva } from "class-variance-authority";
// import { tokens as t} from "@basic-ui/tokens" tailwind doesn't support dynamic class names:(

export const alertVariants = cva("flex gap-md rounded-lg border p-md", {
  variants: {
    severity: {
      success: `border-border-success bg-bg-success text-fg-success`,
      error: `border-border-error bg-bg-error text-fg-error`,
      warning: `border-border-warning bg-bg-warning text-fg-warning`,
      info: `border-border-info bg-bg-info text-fg-info`,
    },
    borderless: {
      true: "border-0 p-0",
      false: "",
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

export const alertTitleVariants = cva("font-semibold text-sm");

export const alertIconVariants = cva("flex-shrink-0 h-5 w-5");

export const alertContentVariants = cva("flex-1 text-sm");

export const alertActionVariants = cva("ml-auto flex items-center gap-sm");