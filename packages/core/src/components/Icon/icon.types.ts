import React from "react";
import type { ResponsiveValue } from "@basic-ui/react-utilities";
import { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type IconColor = "muted" | PaletteColor;

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

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
  size?: ResponsiveValue<IconSize>;

  /**
   * Optional color: `muted` or a palette family. Inherits the parent's
   * color when omitted.
   */
  color?: IconColor;
}
