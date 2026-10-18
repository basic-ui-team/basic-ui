import { cva } from "class-variance-authority";

export const dividerThicknessClasses = {
  horizontal: { thin: "border-t-1", medium: "border-t-2", thick: "border-t-4", none: "border-t-0" },
  vertical: { thin: "border-l-1 border-t-0", medium: "border-l-2 border-t-0", thick: "border-l-4 border-t-0", none: "border-l-0 border-t-0" },
} as const;

export const dividerVariants = cva("flex-shrink-0", {
  variants: {
    direction: {
      horizontal: "h-px",
      vertical: "w-px h-full",
    },
    appearance: {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    },
    color: {
      default: "border-border-base",
      muted: "border-border-muted",
      primary: "border-primary-700 dark:border-primary-300",
      secondary: "border-secondary-700 dark:border-secondary-300",
      error: "border-border-error",
      success: "border-border-success",
      warning: "border-border-warning",
      info: "border-border-info",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    color: "default",
    appearance: "solid",
  },
});
