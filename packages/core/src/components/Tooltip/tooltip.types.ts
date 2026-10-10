import type React from "react";
import type { AnchorAlign, AnchorSide, CommonProps, ResponsiveValue } from "@basic-ui/react-utilities";

export type TooltipSize = "sm" | "md" | "lg";

/**
 * Semantic colour treatment of the tooltip surface, ported from appiq's
 * `TooltipColor` onto basic-ui tokens.
 */
export type TooltipColor = "default" | "inverted" | "primary" | "success" | "warning" | "error" | "info";

export interface TooltipOwnProps extends CommonProps {
  /**
   * The message to display within the tooltip.
   */
  label: React.ReactNode;
  /**
   * The element that triggers the tooltip on hover or focus. Receives
   * `aria-describedby` wiring while the tooltip is open.
   */
  children: React.ReactElement;
  /**
   * Which side of the trigger the tooltip renders on. Flips automatically
   * when there is not enough room (via `useAnchorPositioning`).
   * @default "bottom"
   */
  side?: AnchorSide;
  /**
   * Alignment of the tooltip relative to the trigger along the cross axis.
   * @default "center"
   */
  align?: AnchorAlign;
  /**
   * The delay in milliseconds before showing the tooltip.
   * @default 400
   */
  delay?: number;
  /**
   * The delay in milliseconds before hiding the tooltip.
   * @default 200
   */
  closeDelay?: number;
  /**
   * Whether the tooltip is disabled: it never opens and the trigger keeps
   * its original props (no aria-describedby wiring).
   * @default false
   */
  disabled?: boolean;
  /**
   * Semantic colour treatment of the tooltip surface.
   * @default "inverted"
   */
  color?: TooltipColor;
  /**
   * Renders a 1px border in the colour set by `color`. Useful for `default`
   * (surface) tooltips that need visual separation.
   * @default false
   */
  bordered?: boolean;
  /**
   * Controls padding, font size, and max-width. Responsive.
   * @default "md"
   */
  size?: ResponsiveValue<TooltipSize>;
  /**
   * Whether the tooltip can be dismissed with the Escape key. WCAG 1.4.13
   * requires a dismiss mechanism; disable only when an alternative is
   * provided.
   * @default true
   */
  dismissOnEscape?: boolean;
}

export type TooltipProps = TooltipOwnProps;
