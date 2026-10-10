import { cva } from "class-variance-authority";

export type { TooltipColor } from "./tooltip.types";

/**
 * Tooltip surface variants, ported from appiq's `tooltipVariants` onto
 * basic-ui tokens.
 */
export const tooltipVariants = cva(
  ["z-tooltip", "rounded-md", "shadow-s3", "leading-snug", "pointer-events-auto"].join(" "),
  {
    variants: {
      /**
       * Controls background, text, and border colour. `default` matches the
       * page surface; `inverted` is the classic dark tooltip style.
       */
      color: {
        default: "bg-surface-base text-fg-base border-border-base",
        inverted: "bg-surface-inverted text-fg-inverted border-border-inverted",
        primary: "bg-primary-600 text-fg-inverted border-primary-700",
        success: "bg-bg-success text-fg-success border-border-success",
        warning: "bg-bg-warning text-fg-warning border-border-warning",
        error: "bg-bg-error text-fg-error border-border-error",
        info: "bg-bg-info text-fg-info border-border-info",
      },
      /** Controls padding, font size, and maximum width. */
      size: {
        sm: "px-xs py-xs text-xs max-w-[12rem]",
        md: "px-sm py-xs text-sm max-w-[16rem]",
        lg: "px-md py-sm text-sm max-w-[20rem]",
      },
      /**
       * Renders a 1px border using the colour set by the `color` variant.
       * Useful for `default` (surface) tooltips that need visual separation.
       */
      bordered: {
        true: "border",
        false: "border-transparent",
      },
    },
    defaultVariants: {
      color: "inverted",
      size: "md",
      bordered: false,
    },
  },
);
