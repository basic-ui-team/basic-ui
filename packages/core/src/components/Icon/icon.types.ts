import React from "react";
import type { ResponsiveValue } from "@basic-ui/react-utilities";
import { LayoutProps } from "../../lib";

/**
 * Explicit informational semantic colors aligned with design tokens.
 * The primary path is inheritance: omit `color` and the icon follows the
 * surrounding text color.
 */
type IconColor =
  | "muted"
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * Icon size variants using design token scale
 */
type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps extends LayoutProps, React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The icon to render — can be an SVG component or React node
   * Pass icon components from @basic-ui/icons or custom SVG elements
   */
  icon: React.ReactNode;

  /**
   * Size variant using design token scale
   * @default "md"
   */
  size?: ResponsiveValue<IconSize>;

  /**
   * Optional semantic color. Inherits the parent's color when omitted.
   */
  color?: IconColor;
}
