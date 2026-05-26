import LayoutOwnProps, { PositionType, SpacingType } from "./layout.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import { layoutVariants } from "./layout.variants";

export const generateLayoutClassNames = (layout: LayoutOwnProps["layout"]) => {
  const defaultLayout = {
    padding: "md",
    paddingX: "unset",
    paddingY: "unset",
    margin: "none",
    marginX: "unset",
    marginY: "unset",
    position: "static",
    overflow: "visible",
  };

  const mergedLayout = {
    ...defaultLayout,
    ...(layout || {}),
  };

  const { padding, paddingX, paddingY, margin, marginX, marginY, position, overflow } =
    useResponsiveProps(mergedLayout);

  return cn(
    layoutVariants({
      padding: padding as SpacingType | "unset",
      paddingX: paddingX as SpacingType | "unset",
      paddingY: paddingY as SpacingType | "unset",
      margin: margin as SpacingType | "unset",
      marginX: marginX as SpacingType | "unset",
      marginY: marginY as SpacingType | "unset",
      position: position as PositionType,
      overflow: overflow as "visible" | "hidden" | "auto" | "scroll",
    }),
  );
};
