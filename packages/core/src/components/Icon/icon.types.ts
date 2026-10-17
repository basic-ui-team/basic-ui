import React from "react";
import type { ResponsiveValue } from "@basic-ui/react-utilities";
import { LayoutProps } from "@core/lib";

/**
 * Explicit semantic colors aligned with design tokens.
 */
type IconColor =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
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
