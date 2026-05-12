import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "flex gap-md rounded-lg border p-md",
  {
    variants: {
      severity: {
        success: "border-success bg-success-light/10 text-success-text",
        error: "border-error bg-error-light/10 text-error-text",
        warning: "border-warning bg-warning-light/10 text-warning-text",
        info: "border-info bg-info-light/10 text-info-text",
      },
        borderless: {
            true: "border-0 p-0",
            false: "",
        },
    },
    defaultVariants: {
      severity: "info",
    },
  },
);

export const alertTitleVariants = cva("font-semibold text-sm");

export const alertIconVariants = cva("flex-shrink-0 h-5 w-5");

export const alertContentVariants = cva("flex-1 text-sm");
