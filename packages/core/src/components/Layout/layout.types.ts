import { ResponsiveValue } from "@core/hooks";

export const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SpacingType = (typeof spacingValues)[number];

export type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";

export interface LayoutOwnProps {
  // Layout object for easy access and reducing boilerplate. Allows us to pass layout to generateLayoutClassNames in one go, rather than each prop separately.
  layout: {
    /* Padding */
    padding?: ResponsiveValue<SpacingType | "unset">;
    paddingX?: ResponsiveValue<SpacingType | "unset">;
    paddingY?: ResponsiveValue<SpacingType | "unset">;

    /* Margin */
    margin?: ResponsiveValue<SpacingType | "unset">;
    marginX?: ResponsiveValue<SpacingType | "unset">;
    marginY?: ResponsiveValue<SpacingType | "unset">;

    /* Positioning */
    position?: ResponsiveValue<PositionType>;

    overflow?: ResponsiveValue<"visible" | "hidden" | "auto" | "scroll">;
  };
}

export default LayoutOwnProps;
