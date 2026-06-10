import { ResponsiveValue } from "@core/index";
import { BuiltInSemanticColors } from "@core/theme";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

type buttonVariants = "solid" | "ghost" | "outline" | "link";
type buttonSizes = "sm" | "md" | "lg";
type buttonColors = BuiltInSemanticColors;
export type AllowedButtonElements = "button" | "a";

export interface ButtonOwnProps extends CommonProps {
  /** Variant of the button, which determines its visual style. */
  variant?: buttonVariants;
  /** Size of the button, which can be responsive. */
  size?: ResponsiveValue<buttonSizes>;
  /** Semantic color of the button, which maps to theme colors. */
  color?: buttonColors;
  /** If true, disables the button and applies appropriate disabled styles and attributes. */
  disabled?: boolean;
  /** If true, shows loading state with spinner/icon and optional loading text. */
  loading?: boolean;
  /** Optional custom loading icon to display when in loading state. If not provided, will default to spinner or variant-specific icon. */
  loadingIcon?: React.ReactNode;
  /** Optional loading text to display when in loading state. If not provided, will just show spinner/icon. */
  loadingText?: string;
  /**
   * Custom link component (e.g., Next.js `Link`, React Router `Link`).
   * Only used when rendering as 'a' element. Defaults to native 'a'.
   */
  linkComponent?: React.ElementType;
}

export type ButtonProps<As extends AllowedButtonElements = "button"> = RestrictedPropsWithAs<
  ButtonOwnProps,
  As
>;
