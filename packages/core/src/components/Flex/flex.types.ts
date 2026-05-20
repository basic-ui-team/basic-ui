import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export const paddingOptions = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;

export type gapSize = (typeof paddingOptions)[number];
export type paddingSize = (typeof paddingOptions)[number];
type flexWrap = "nowrap" | "wrap" | "wrap-reverse";
type flexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type justifyContent = "start" | "end" | "center" | "between" | "around" | "evenly";
type alignItems = "start" | "end" | "center" | "stretch" | "baseline";

export interface FlexOwnProps extends CommonProps {
  direction?: ResponsiveValue<flexDirection>;
  gap?: ResponsiveValue<gapSize | string | number>;
  padding?: ResponsiveValue<paddingSize | string | number>;
  paddingX?: ResponsiveValue<paddingSize | string | number>;
  paddingY?: ResponsiveValue<paddingSize | string | number>;
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
