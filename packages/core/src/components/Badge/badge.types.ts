import { ResponsiveValue } from "@core/hooks";
import { BuiltInSemanticColors } from "@core/theme";
import { CommonProps } from "@core/types/props";

export type BadgeVariant = "standard" | "dot";
export type BadgeSize = "small" | "medium" | "large";
export type BadgeShape = "rounded" | "square" | "circular";
export type BadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type BadgeColor = Exclude<BuiltInSemanticColors, "default" | "muted">;

export interface BadgeProps extends CommonProps {
  /** The content to be displayed within the badge. Can be a string, number, or any React node. */
  content?: React.ReactNode;
  /** The maximum value to display. If the content is a number and exceeds this value, it will be displayed as "max+". */
  max?: number;

  /** The color of the badge. Can be a predefined color name or a custom CSS color value. @default "primary" */
  color?: BadgeColor;

  /** The variant of the badge. @default "standard" */
  variant?: BadgeVariant;

  /** The size of the badge. @default "medium" */
  size?: ResponsiveValue<BadgeSize>;

  /** The shape of the badge. @default "circular" */
  shape?: BadgeShape;

  /** Whether the badge is visible. @default true */
  visible?: boolean;

  /** The position of the badge relative to its parent element. @default "top-right" */
  position?: BadgePosition;

  /** Whether the badge should have a pulsing animation. @default false */
  ping?: boolean;

  /** Accessibility label for the badge content. Use for dynamic updates (e.g., notification count). */
  ariaLabel?: string;

  /** Hide badge from screen readers. Set to false for announcements (e.g., status updates). @default true */
  ariaHidden?: boolean;

  /** Indicate polite or assertive ARIA live region announcements for dynamic content. */
  ariaLive?: "polite" | "assertive" | "off";
}
