import { ResponsiveValue } from "@core/hooks";

export const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SpacingType = (typeof spacingValues)[number];

export const heightWidthValues = ["auto", "full"] as const;
export type HeightType = (typeof heightWidthValues)[number];
export type WidthType = (typeof heightWidthValues)[number];

export type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";

export type OverflowType = "visible" | "hidden" | "auto" | "scroll";

export interface LayoutProps {
  p?: ResponsiveValue<SpacingType | "unset">;
  px?: ResponsiveValue<SpacingType | "unset">;
  py?: ResponsiveValue<SpacingType | "unset">;

  m?: ResponsiveValue<SpacingType | "unset">;
  mx?: ResponsiveValue<SpacingType | "unset">;
  my?: ResponsiveValue<SpacingType | "unset">;

  h?: ResponsiveValue<HeightType>;
  hMin?: ResponsiveValue<HeightType>;
  hMax?: ResponsiveValue<HeightType>;
  w?: ResponsiveValue<WidthType>;
  wMin?: ResponsiveValue<WidthType>;
  wMax?: ResponsiveValue<WidthType>;

  position?: ResponsiveValue<PositionType>;

  overflow?: ResponsiveValue<OverflowType>;
  overflowX?: ResponsiveValue<OverflowType>;
  overflowY?: ResponsiveValue<OverflowType>;

}

export default LayoutProps;
