import { cva } from "class-variance-authority";

export const alertVariants = cva("flex gap-3 rounded-lg p-3 items-center", {
  variants: {
    severity: {
      success: "text-fg-success",
      error: "text-fg-error",
      warning: "text-fg-warning",
      info: "text-fg-info",
    },
    variant: {
      subtle: "border",
      outline: "border-2 bg-surface-base",
    },
  },
  compoundVariants: [
    {
      severity: "success",
      variant: "subtle",
      className: "border-border-success bg-bg-success",
    },
    {
      severity: "error",
      variant: "subtle",
      className: "border-border-error bg-bg-error",
    },
    {
      severity: "warning",
      variant: "subtle",
      className: "border-border-warning bg-bg-warning",
    },
    {
      severity: "info",
      variant: "subtle",
      className: "border-border-info bg-bg-info",
    },
    {
      severity: "success",
      variant: "outline",
      className: "border-border-success",
    },
    {
      severity: "error",
      variant: "outline",
      className: "border-border-error",
    },
    {
      severity: "warning",
      variant: "outline",
      className: "border-border-warning",
    },
    {
      severity: "info",
      variant: "outline",
      className: "border-border-info",
    },
  ],
  defaultVariants: {
    severity: "info",
    variant: "subtle",
  },
});

export const alertTitleVariants = cva("font-semibold text-sm");


export const alertContentVariants = cva("flex-1 text-sm");

export const alertActionVariants = cva("ml-auto flex items-center gap-2");

export const alertDismissButtonVariants = cva(
  "shrink-0 -mr-2 -my-2 rounded p-2 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
);
