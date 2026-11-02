import { cva } from "class-variance-authority";

/**
 * Alert severity styling maps each severity to its status token pair:
 * `filled` uses the pair directly (AA-verified by the tokens contract
 * test); `outline` and `subtle` express the status through border and
 * tint while the body text stays on `foreground`, which keeps AA in both
 * modes regardless of status color.
 */
export const alertSeverityClasses = {
  success: {
    filled: "bg-success text-success-foreground",
    outline: "border-success text-foreground",
    subtle: "border-l-4 border-l-success bg-success/10 text-foreground",
  },
  warning: {
    filled: "bg-warning text-warning-foreground",
    outline: "border-warning text-foreground",
    subtle: "border-l-4 border-l-warning bg-warning/10 text-foreground",
  },
  destructive: {
    filled: "bg-destructive text-destructive-foreground",
    outline: "border-destructive text-foreground",
    subtle: "border-l-4 border-l-destructive bg-destructive/10 text-foreground",
  },
  info: {
    filled: "bg-info text-info-foreground",
    outline: "border-info text-foreground",
    subtle: "border-l-4 border-l-info bg-info/10 text-foreground",
  },
} as const;

export const alertTitleVariants = cva("font-semibold text-sm");

export const alertContentVariants = cva("flex-1 text-sm");

export const alertActionVariants = cva("ml-auto flex items-center gap-2");

export const alertDismissButtonVariants = cva(
  "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current cursor-pointer",
);

export const alertSeverityIconClasses = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
} as const;

/**
 * Container classes per variant. In `filled` the container carries the
 * status pair; otherwise the severity classes above carry it.
 */
export const alertVariants = cva("flex gap-3 rounded-lg px-4 py-2", {
  variants: {
    variant: {
      subtle: "",
      filled: "",
      outline: "border-2",
    },
  },
  defaultVariants: {
    variant: "subtle",
  },
});
