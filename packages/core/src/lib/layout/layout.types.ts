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
  pt?: ResponsiveValue<SpacingType | "unset">;
  pr?: ResponsiveValue<SpacingType | "unset">;
  pb?: ResponsiveValue<SpacingType | "unset">;
  pl?: ResponsiveValue<SpacingType | "unset">;

  m?: ResponsiveValue<SpacingType | "unset">;
  mx?: ResponsiveValue<SpacingType | "unset">;
  my?: ResponsiveValue<SpacingType | "unset">;
  mt?: ResponsiveValue<SpacingType | "unset">;
  mr?: ResponsiveValue<SpacingType | "unset">;
  mb?: ResponsiveValue<SpacingType | "unset">;
  ml?: ResponsiveValue<SpacingType | "unset">;

  gap?: ResponsiveValue<SpacingType | "unset">;

  h?: ResponsiveValue<HeightType | "unset">;
  hMin?: ResponsiveValue<HeightType | "unset">;
  hMax?: ResponsiveValue<HeightType | "unset">;
  w?: ResponsiveValue<WidthType | "unset">;
  wMin?: ResponsiveValue<WidthType | "unset">;
  wMax?: ResponsiveValue<WidthType | "unset">;

  position?: ResponsiveValue<PositionType>;

  overflow?: ResponsiveValue<OverflowType | "unset">;
  overflowX?: ResponsiveValue<OverflowType | "unset">;
  overflowY?: ResponsiveValue<OverflowType | "unset">;
}

export default LayoutProps;
