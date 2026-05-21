import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
const flexValues = ["row", "column", "row-reverse", "column-reverse"];
const justifyValues = ["start", "end", "center", "between", "around", "evenly", "stretch"];
const alignValues = ["start", "end", "center", "stretch"];
const wrapValues = ["nowrap", "wrap", "reverse"];

type spacingType = (typeof spacingValues)[number];
type flexDirection = (typeof flexValues)[number];
type justifyContent = (typeof justifyValues)[number];
type alignItems = (typeof alignValues)[number];
type flexWrap = (typeof wrapValues)[number];

export interface FlexOwnProps extends CommonProps {
  direction?: ResponsiveValue<flexDirection>;
  gap?: ResponsiveValue<spacingType | string | number>;
  padding?: ResponsiveValue<spacingType | string | number>;
  paddingX?: ResponsiveValue<spacingType | string | number>;
  paddingY?: ResponsiveValue<spacingType | string | number>;
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
