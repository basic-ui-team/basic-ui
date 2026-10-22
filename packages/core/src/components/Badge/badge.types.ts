import type React from "react";
import type { CommonProps } from "@basic-ui/react-utilities";
import type { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type BadgeVariant = "count" | "dot";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type BadgeColor = "default" | PaletteColor;

export interface BadgeSharedProps extends Omit<CommonProps, "children"> {
  /** The element to which the badge is attached. */
  children: React.ReactElement;

  /** Palette family for the badge. "default" renders slate. @default "default" */
  color?: BadgeColor;

  /** The position of the badge relative to its parent element. @default "top-right" */
  position?: BadgePosition;

  /** Whether the badge should have a pulsing animation. @default false */
  ping?: boolean;

  /** Accessible name required when the badge is exposed to assistive technologies. */
  "aria-label"?: string;

  /** Whether the badge is decorative. Defaults to true when it has no accessible name or live region. */
  "aria-hidden"?: boolean;

  /** Opt in to dynamic announcements when the badge is not decorative. */
  "aria-live"?: "polite" | "assertive" | "off";
}

export interface BadgeCountProps {
  /** The count or label to display. */
  content: React.ReactNode;

  /** The maximum numeric value before the badge displays `max+`. */
  max?: number;

  /** The visible count indicator. @default "count" */
  variant?: "count";
}

export interface BadgeDotProps {
  /** The compact status indicator. */
  variant: "dot";
  content?: never;
  max?: never;
}

export type BadgeProps = BadgeSharedProps & (BadgeCountProps | BadgeDotProps);
