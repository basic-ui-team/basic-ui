import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";
import { ResponsiveValue } from "@core/hooks";
import LayoutProps from "../../lib/layout/layout.types";
import { BuiltInSemanticColors } from "@core/theme";

export type SpinnerColor = BuiltInSemanticColors;
export type SpinnerSizes = "xs" | "sm" | "md" | "lg" | "xl";

export type AllowedSpinnerElements = "div" | "span";

export interface SpinnerOwnProps
  extends CommonProps,
    Pick<LayoutProps, "m" | "mx" | "my" | "mb" | "ml" | "mr" | "mt"> {
  /** Size of the spinner. @default "md" */
  size?: ResponsiveValue<SpinnerSizes>;

  /** Color of the spinner. Accepts built-in semantic colors. @default "default" */
  color?: SpinnerColor;


  /** Whether the spinner is visible or hidden. @default true */
  visible?: boolean;

  /** Optional ARIA label for accessibility. If not provided, a default label will be used. */
  ariaLabel?: string;
}

export type SpinnerProps<As extends AllowedSpinnerElements = "div"> = RestrictedPropsWithAs<
  SpinnerOwnProps,
  As
>;
