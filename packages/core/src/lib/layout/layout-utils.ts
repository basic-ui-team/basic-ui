import LayoutProps, {
  HeightType,
  OverflowType,
  PositionType,
  SpacingType,
  WidthType,
} from "./layout.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import layoutVariants from "./layout.variants";

export const LAYOUT_PROP_NAMES = [
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
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
    p: "none",
    px: "unset",
    py: "unset",
    pt: "unset",
    pr: "unset",
    pb: "unset",
    pl: "unset",
    m: "none",
    mx: "unset",
    my: "unset",
    mt: "unset",
    mr: "unset",
    mb: "unset",
    ml: "unset",
    gap: "unset",
    h: "unset",
    hMin: "unset",
    hMax: "unset",
    w: "unset",
    wMin: "unset",
    wMax: "unset",
    position: "static",
    overflow: "unset",
    overflowX: "unset",
    overflowY: "unset",
  } as LayoutProps;

  const mergedLayout = {
    ...defaultLayout,
    ...(layout || {}),
  };

  const {
    p: padding,
    px: paddingX,
    py: paddingY,
    pt: paddingTop,
    pr: paddingRight,
    pb: paddingBottom,
    pl: paddingLeft,
    m: margin,
    mx: marginX,
    my: marginY,
    mt: marginTop,
    mr: marginRight,
    mb: marginBottom,
    ml: marginLeft,
    gap,
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
      paddingTop: paddingTop as SpacingType | "unset",
      paddingRight: paddingRight as SpacingType | "unset",
      paddingBottom: paddingBottom as SpacingType | "unset",
      paddingLeft: paddingLeft as SpacingType | "unset",
      margin: margin as SpacingType | "unset",
      marginX: marginX as SpacingType | "unset",
      marginY: marginY as SpacingType | "unset",
      marginTop: marginTop as SpacingType | "unset",
      marginRight: marginRight as SpacingType | "unset",
      marginBottom: marginBottom as SpacingType | "unset",
      marginLeft: marginLeft as SpacingType | "unset",
      gap: gap as SpacingType | "unset",
      height: h as HeightType,
      heightMin: hMin as HeightType,
      heightMax: hMax as HeightType,
      width: w as WidthType,
      widthMin: wMin as WidthType,
      widthMax: wMax as WidthType,
      position: position as PositionType,
      overflow: overflow as OverflowType ,
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
