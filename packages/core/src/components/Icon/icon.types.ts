import React from "react";
import type { ResponsiveValue } from "@core/lib";

/**
 * Icon semantic color variants aligned with design tokens
 */
export type IconVariant =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * Explicit light/dark text color override, independent of semantic variant.
 * Use when the icon sits on a colored or inverted surface.
 * - `"default"` — inherits no forced color (semantic variant applies)
 * - `"light"` — forces `--color-text-light` (gray-500)
 * - `"dark"` — forces `--color-text` (gray-800 in light mode)
 */
export type IconColor = "default" | "light" | "dark";

/**
 * Icon size base values (without responsive wrapping)
 */
export type IconSizeValue = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Icon size variants using design token scale
 */
export type IconSize = ResponsiveValue<IconSizeValue>;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The icon to render — can be an SVG component or React node
   * Pass icon components from @basic-ui/icons or custom SVG elements
   */
  icon: React.ReactNode;

  /**
   * Size variant using design token scale
   * @default "md"
   */
  size?: IconSize;

  /**
   * Color variant aligned with design tokens
   * @default "default"
   */
  variant?: IconVariant;

  /**
   * Explicit light/dark text color override.
   * Overrides the `variant` color when set to `"light"` or `"dark"`.
   * @default "default"
   */
  color?: IconColor;
}
