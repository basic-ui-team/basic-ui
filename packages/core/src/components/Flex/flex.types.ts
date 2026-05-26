import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";
import type { LayoutOwnProps } from "@core/components/Layout/layout.types";

const flexValues = ["row", "column", "row-reverse", "column-reverse"] as const;
const justifyValues = ["start", "end", "center", "between", "around", "evenly", "stretch"] as const;
const alignValues = ["start", "end", "center", "stretch"] as const;
const wrapValues = ["nowrap", "wrap", "reverse"] as const;

type flexDirection = (typeof flexValues)[number];
type justifyContent = (typeof justifyValues)[number];
type alignItems = (typeof alignValues)[number];
type flexWrap = (typeof wrapValues)[number];

export interface FlexOwnProps extends LayoutOwnProps, CommonProps {
  direction?: ResponsiveValue<flexDirection>;
  justify?: ResponsiveValue<justifyContent>;
  align?: ResponsiveValue<alignItems>;
  wrap?: ResponsiveValue<flexWrap>;
  inline?: ResponsiveValue<boolean>;
}

export type AllowedFlexElements = "div" | "section" | "article" | "nav" | "header" | "footer";

export type FlexProps<As extends AllowedFlexElements = "div"> = RestrictedPropsWithAs<
  FlexOwnProps,
  As
>;
