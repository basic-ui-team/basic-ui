import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export type AllowedTextElements = "span" | "p" | "div";

interface TextOwnProps extends CommonProps {
  /** Size of the text. @default "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Font weight. @default "normal" */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text color. @default "default" */
  color?: "default" | "muted" | "primary" | "secondary" | "error" | "success" | "warning";
  /** Text alignment. @default "left" */
  align?: "left" | "center" | "right";
  /** Truncate text with ellipsis. @default false */
  truncate?: boolean;
}

export type TextProps<As extends AllowedTextElements = "span"> = RestrictedPropsWithAs<
  TextOwnProps,
  As
>;
