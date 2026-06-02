import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";
import { LayoutProps } from "../../lib/layout";
import { BuiltInSemanticColors } from "@core/theme/colors";

export type AllowedTextElements = "span" | "p" | "div";

export interface TextOwnProps extends CommonProps, LayoutProps {
  /** Size of the text. @default "md" */
  size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl">;
  /** Font weight. @default "normal" */
  weight?: ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  /** Text color. @default "default" */
  color?: ResponsiveValue<BuiltInSemanticColors | string>;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Truncate text with ellipsis. @default false */
  truncate?: ResponsiveValue<boolean>;
  /** Text wrapping behavior. @default "nowrap" */
  wrap?: ResponsiveValue<"nowrap" | "wrap" | "balance" | "pretty">;
}

export type TextProps<As extends AllowedTextElements = "p"> = RestrictedPropsWithAs<
  TextOwnProps,
  As
>;
