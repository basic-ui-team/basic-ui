import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export type AllowedTextElements = "span" | "p" | "div";

export type builtInColorUnion =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "error"
  | "success"
  | "warning"
  | "info";

interface TextOwnProps extends CommonProps {
  /** Size of the text. @default "md" */
  size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl">;
  /** Font weight. @default "normal" */
  weight?: ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  /** Text color. @default "default" */
  color?: ResponsiveValue<builtInColorUnion | string>;
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
