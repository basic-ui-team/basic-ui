import { CommonProps, ResponsiveValue, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import { SpacingStep } from "../../lib";
import { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type DividerDirection = "horizontal" | "vertical";
export type DividerAppearance = "solid" | "dashed" | "dotted";
export type DividerColor = "default" | "muted" | PaletteColor;
export type DividerThickness = "thin" | "medium" | "thick" | "none";

export interface DividerOwnProps extends CommonProps {
  /** Scalar direction, shared by visual geometry and aria-orientation. @default "horizontal" */
  direction?: DividerDirection;

  /** Whether the divider is decorative (visual only) or semantic (carries meaning).
   * Use `decorative={true}` for purely visual separators (will set `role="presentation"`).
   * Use `decorative={false}` for semantic dividers between sections. @default true */
  decorative?: boolean;

  /** Scalar border style. @default "solid" */
  appearance?: DividerAppearance;

  /** Thickness of the divider line. "thin" for 1px, "medium" for 2px, "thick" for 4px, "none" for no line. Supports responsive values. @default "medium" */
  thickness?: ResponsiveValue<DividerThickness>;

  /** Inset spacing from the edges. For horizontal dividers, this controls left/right padding; for vertical dividers, it controls top/bottom padding. Supports responsive values. @default 0 */
  inset?: ResponsiveValue<SpacingStep>;

  /** Border color: structural neutral, informational severity, or palette family. @default "default" */
  color?: DividerColor;

  /** Optional label for the divider, used for accessibility purposes. If provided, the divider will have `role="separator"` and the label will be announced by screen readers. */
  label?: string;

  /** Margin around the divider. Supports responsive values. Passed down to the Box component. @default 0 */
  m?: ResponsiveValue<SpacingStep>;

  /** Padding around the divider. Supports responsive values. Passed down to the Box component. @default 0 */
  p?: ResponsiveValue<SpacingStep>;
}

export type AllowedDividerElements = "hr" | "div" | "span";

export type DividerProps<As extends AllowedDividerElements = "hr"> = RestrictedPropsWithAs<
  DividerOwnProps,
  As
>;

export default DividerOwnProps;
