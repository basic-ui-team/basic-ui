import { ResponsiveValue } from "@basic-ui/react-utilities";
import { CommonProps, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import type { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

type buttonVariants = "solid" | "ghost" | "outline" | "link";
type buttonSizes = "sm" | "md" | "lg";
export type AllowedButtonElements = "button" | "a";

export interface ButtonOwnProps extends CommonProps {
  /** Variant of the button, which determines its visual style. */
  variant?: buttonVariants;
  /** Size of the button, which can be responsive. */
  size?: ResponsiveValue<buttonSizes>;
  /** Color of the button. */
  color?: PaletteColor;
  /** If true, disables the button and applies appropriate disabled styles and attributes. */
  disabled?: boolean;
  /** If true, marks the button busy and disables interaction. */
  loading?: boolean;
  /** Optional loading icon element. Provide its own sizing and styling; no icon is rendered by default. */
  loadingIcon?: React.ReactNode;
  /** Optional text to replace children while loading. If omitted, children remain visible. */
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
