import type React from "react";
import type { CommonProps, UseTooltipProps } from "@basic-ui/react-utilities";

type TooltipBehaviorProps = Pick<
  UseTooltipProps<HTMLDivElement>,
  | "side"
  | "align"
  | "sideOffset"
  | "viewportPadding"
  | "delay"
  | "closeDelay"
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "disabled"
  | "dismissOnEscape"
>;

export interface TooltipProps extends CommonProps, TooltipBehaviorProps {
  /**
   * The message to display within the tooltip.
   */
  label: React.ReactNode;
  /**
   * The element that triggers the tooltip on hover or focus. Receives
   * `aria-describedby` wiring while the tooltip is open.
   */
  children: React.ReactElement;
}
