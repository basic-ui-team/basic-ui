import { CommonProps, ResponsiveValue, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import { LayoutProps } from "@core/lib";
import { BuiltInSemanticColors } from "@core/theme/colors";

export type AllowedTextElements = "span" | "p" | "div";

export interface TextOwnProps extends CommonProps, LayoutProps {
  /** Size of the text. @default "md" */
  size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl">;
  /** Font weight. @default "normal" */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text color. @default "default" */
  color?: BuiltInSemanticColors | string;
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
