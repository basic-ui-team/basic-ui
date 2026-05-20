import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export interface HeaderOwnProps extends CommonProps {
  /** Size of the header. @default "h2" */
  size?: ResponsiveValue<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
  /** Font weight. @default "normal" */
  weight?: ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  /** Color of the header. @default "default" */
  color?: ResponsiveValue<"default" | "primary" | "secondary" | string>;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Truncate the text. @default false */
  truncate?: ResponsiveValue<boolean>;
  /** Text wrapping behavior. @default "nowrap" */
  wrap?: ResponsiveValue<"wrap" | "nowrap" | "pretty" | "balance">;
}

/** Allowed header elements. */
export type AllowedHeaderElements = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type HeaderProps<As extends AllowedHeaderElements = "h2"> = RestrictedPropsWithAs<
  HeaderOwnProps,
  As
>;
