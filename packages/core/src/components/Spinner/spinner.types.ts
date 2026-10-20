import { CommonProps, ResponsiveValue, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import { LayoutProps } from "../../lib";
import { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type SpinnerColor = "default" | "muted" | PaletteColor;
export type SpinnerSizes = "xs" | "sm" | "md" | "lg" | "xl";

export type AllowedSpinnerElements = "div" | "span";

export interface SpinnerOwnProps
  extends CommonProps,
    Pick<LayoutProps, "m" | "mx" | "my" | "mb" | "ml" | "mr" | "mt"> {
  /** Size of the spinner. @default "md" */
  size?: ResponsiveValue<SpinnerSizes>;

  /** Color of the spinner: structural neutral, informational severity, or palette family. @default "default" */
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
