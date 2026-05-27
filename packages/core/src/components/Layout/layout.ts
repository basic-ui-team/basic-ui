import LayoutProps, { HeightType, OverflowType, PositionType, SpacingType, WidthType } from "./layout.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import { layoutVariants } from "./layout.variants";

export const LAYOUT_PROP_NAMES = [
  "p",
  "px",
  "py",
  "m",
  "mx",
  "my",
  "h",
  "hMin",
  "hMax",
  "w",
  "wMin",
  "wMax",
  "position",
  "overflow",
  "overflowX",
  "overflowY",
] as const;

export const generateLayoutClassNames = (layout: LayoutProps) => {
  const defaultLayout = {
    p: "md",
    px: "unset",
    py: "unset",
    m: "none",
    mx: "unset",
    my: "unset",
    h: "auto",
    hMin: "auto",
    hMax: "auto",
    w: "auto",
    wMin: "auto",
    wMax: "auto",
    position: "static",
    overflow: "visible",
    overflowX: "visible",
    overflowY: "visible",
  } as LayoutProps;

  const mergedLayout = {
    ...defaultLayout,
    ...(layout || {}),
  };

  const {
    p: padding,
    px: paddingX,
    py: paddingY,
    m: margin,
    mx: marginX,
    my: marginY,
    h,
    hMin,
    hMax,
    w,
    wMin,
    wMax,
    position,
    overflow,
    overflowX,
    overflowY,
  } = useResponsiveProps(mergedLayout, LAYOUT_PROP_NAMES as unknown as (keyof LayoutProps)[]); // Pass layout prop names as ordered keys to ensure consistent class name generation regardless of the order in which layout props are provided by the user

  return cn(
    layoutVariants({
      padding: padding as SpacingType | "unset",
      paddingX: paddingX as SpacingType | "unset",
      paddingY: paddingY as SpacingType | "unset",
      margin: margin as SpacingType | "unset",
      marginX: marginX as SpacingType | "unset",
      marginY: marginY as SpacingType | "unset",
      height: h as HeightType,
      heightMin: hMin as HeightType,
      heightMax: hMax as HeightType,
      width: w as WidthType,
      widthMin: wMin as WidthType,
      widthMax: wMax as WidthType,
      position: position as PositionType,
      overflow: overflow as OverflowType,
      overflowX: overflowX as OverflowType,
      overflowY: overflowY as OverflowType,
    }),
  );
};

export function splitLayoutProps<T extends Record<string, unknown> = Record<string, unknown>>(
  props?: T,
): { layout: Partial<LayoutProps>; rest: Omit<T, keyof LayoutProps> } {
  const layout: Partial<LayoutProps> = {};
  const rest: Record<string, unknown> = {};

  if (!props) return { layout, rest: rest as Omit<T, keyof LayoutProps> };

  const layoutPropKeySet = new Set(LAYOUT_PROP_NAMES);

  for (const key of Object.keys(props)) {
    if (layoutPropKeySet.has(key as keyof LayoutProps)) {
      layout[key as keyof LayoutProps] = (props as any)[key];
    } else {
      rest[key] = (props as any)[key];
    }
  }

  return { layout, rest: rest as Omit<T, keyof LayoutProps> };
}
