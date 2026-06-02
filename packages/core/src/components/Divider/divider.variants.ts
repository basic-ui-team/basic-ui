import { cva } from "class-variance-authority";

export const dividerVariants = cva("flex-shrink-0", {
  variants: {
    direction: {
      horizontal: "h-px",
      vertical: "w-px h-full",
    },
    appearance: {
      solid: "border-t",
      dashed: "border-t border-t-border-base border-dashed",
      dotted: "border-t border-t-border-base border-dotted",
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
    thickness: {
      thin: "border-t-[1px]",
      medium: "border-t-[2px]",
      thick: "border-t-[4px]",
      none: "border-t-0",
    },
  },
  compoundVariants: [
    {
      direction: "vertical",
      appearance: "dashed",
      className: " border-l-border-base border-dashed border-t-0",
    },
    {
      direction: "vertical",
      appearance: "dotted",
      className: "border-l-border-base border-dotted border-t-0",
    },
    {
      direction: "vertical",
      thickness: "thin",
      className: "border-l-[1px] border-t-0",
    },
    {
      direction: "vertical",
      thickness: "medium",
      className: "border-l-[2px] border-t-0",
    },
    {
      direction: "vertical",
      thickness: "thick",
      className: "border-l-[4px] border-t-0",
    },
    {
      direction: "vertical",
      thickness: "none",
      className: "border-l-0 border-t-0",
    },
  ],
  defaultVariants: {
    direction: "horizontal",
    thickness: "medium",
    color: "default",
    appearance: "solid",
  },
});
