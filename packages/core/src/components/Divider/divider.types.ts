import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";
import { SpacingType } from "../../lib/layout/layout.types";

export type DividerDirection = "horizontal" | "vertical";
export type DividerAppearance = "solid" | "dashed" | "dotted";
export type DividerColor = "base" | "muted";
export type DividerThickness = "thin" | "medium" | "thick" | "none";

export interface DividerOwnProps extends CommonProps {
  /** Direction of the divider line. Supports responsive values. @default "horizontal" */
  direction?: ResponsiveValue<DividerDirection>;

  /** Whether the divider is decorative (visual only) or semantic (carries meaning).
   * Use `decorative={true}` for purely visual separators (will set `role="presentation"`).
   * Use `decorative={false}` for semantic dividers between sections. @default true */
  decorative?: boolean;

  /** Visual appearance: "solid" for single line, "dashed" for dashed, "dotted" for dots. Supports responsive values. @default "solid" */
  appearance?: ResponsiveValue<DividerAppearance>;

  /** Thickness of the divider line. "thin" for 1px, "medium" for 2px, "thick" for 4px, "none" for no line. Supports responsive values. @default "medium" */
  thickness?: ResponsiveValue<DividerThickness>;

  /** Inset spacing from the edges. For horizontal dividers, this controls left/right padding; for vertical dividers, it controls top/bottom padding. Supports responsive values. @default "none" */
  inset?: ResponsiveValue<SpacingType>;

  /** Color of the divider line. Supports responsive values. Accepts built-in semantic tokens or a custom CSS color string. @default "base" */
  color?: ResponsiveValue<DividerColor>;

  /** Optional label for the divider, used for accessibility purposes. If provided, the divider will have `role="separator"` and the label will be announced by screen readers. */
  label?: string;

  /** Margin around the divider. Supports responsive values. Passed down to the Box component. @default 0 */
  m?: ResponsiveValue<SpacingType>;

  /** Padding around the divider. Supports responsive values. Passed down to the Box component. @default 0 */
  p?: ResponsiveValue<SpacingType>;
}

export type AllowedDividerElements = "hr" | "div" | "span";

export type DividerProps<As extends AllowedDividerElements = "hr"> = RestrictedPropsWithAs<
  DividerOwnProps,
  As
>;

export default DividerOwnProps;
