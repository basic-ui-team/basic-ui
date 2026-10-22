import { CommonProps, ResponsiveValue, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import { type TextFlowOverflowProps } from "../../lib";
import { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type AllowedTextElements = "span" | "p" | "div";

/** Text color: structural neutral, informational severity, or palette family. */
export type TextColor = "default" | "muted" | PaletteColor;

export interface TextOwnProps extends CommonProps, TextFlowOverflowProps {
  /** Size of the text. @default "md" */
  size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl">;
  /** Font weight. @default "normal" */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text color: structural neutral, informational severity, or palette family. @default "default" */
  color?: TextColor;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Single-line ellipsis. Overrides wrap and overflow while active. @default false */
  truncate?: ResponsiveValue<boolean>;
  /** Text wrapping behavior. @default "wrap" */
  wrap?: ResponsiveValue<"nowrap" | "wrap" | "balance" | "pretty">;
}

export type TextProps<As extends AllowedTextElements = "p"> = RestrictedPropsWithAs<
  TextOwnProps,
  As
>;
