import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";
import type { LayoutProps } from "@core/components/Layout/layout.types";
import { ResponsiveValue } from "@core/hooks";

export type AllowedBoxElements =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "nav"
  | "header"
  | "footer"
  | "span";

export interface BoxOwnProps extends LayoutProps, CommonProps {
  display?: ResponsiveValue<"block" | "inline-block" | "inline" | "none">;
}

export type BoxProps<As extends AllowedBoxElements = "div"> = RestrictedPropsWithAs<
  BoxOwnProps,
  As
>;

export default BoxOwnProps;
