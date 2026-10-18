import { ResponsiveValue } from "@basic-ui/react-utilities";
import { type CommonProps, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import type { LayoutProps } from "../../lib";
import { BuiltInSemanticColors } from "../../theme";

export interface HeaderOwnProps extends CommonProps, LayoutProps {
  /** Fixed visual size, independent of heading semantics. Use responsive values for breakpoint changes. @default "h2" */
  size?: ResponsiveValue<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
  /** Font weight. @default "normal" */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Color of the header. @default "default" */
  color?: BuiltInSemanticColors | string;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Single-line ellipsis. Overrides wrap and overflow while active. @default false */
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
