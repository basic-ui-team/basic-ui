import { ResponsiveValue } from "@core/hooks";

export const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SpacingType = (typeof spacingValues)[number];

export type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";

export interface LayoutProps {
  p?: ResponsiveValue<SpacingType | "unset">;
  px?: ResponsiveValue<SpacingType | "unset">;
  py?: ResponsiveValue<SpacingType | "unset">;

  m?: ResponsiveValue<SpacingType | "unset">;
  mx?: ResponsiveValue<SpacingType | "unset">;
  my?: ResponsiveValue<SpacingType | "unset">;

  position?: ResponsiveValue<PositionType>;

  overflow?: ResponsiveValue<"visible" | "hidden" | "auto" | "scroll">;
}

export default LayoutProps;
