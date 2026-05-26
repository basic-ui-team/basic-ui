import LayoutOwnProps from "./layout.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import { layoutVariants } from "./layout.variants";

export const generateLayoutClassNames = (layout: LayoutOwnProps["layout"]) => {
  const {
    padding = "md",
    paddingX = "unset",
    paddingY = "unset",
    margin = "unset",
    marginX = "unset",
    marginY = "unset",
    position,
    overflow,
  } = layout;

  const responsiveProps = useResponsiveProps({
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    position,
    overflow,
  });

  return cn(
    layoutVariants({
      padding: responsiveProps.padding,
      paddingX: responsiveProps.paddingX,
      paddingY: responsiveProps.paddingY,
      margin: responsiveProps.margin,
      marginX: responsiveProps.marginX,
      marginY: responsiveProps.marginY,
      position: responsiveProps.position,
      overflow: responsiveProps.overflow,
    }),
  );
};
