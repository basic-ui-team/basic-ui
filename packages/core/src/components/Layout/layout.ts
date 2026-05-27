import LayoutProps, { PositionType, SpacingType } from "./layout.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import { layoutVariants } from "./layout.variants";

export const generateLayoutClassNames = (layout: LayoutProps) => {
  const defaultLayout = {
    p: "md",
    px: "unset",
    py: "unset",
    m: "none",
    mx: "unset",
    my: "unset",
    position: "static",
    overflow: "visible",
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
    position,
    overflow,
  } = useResponsiveProps(mergedLayout);

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

export const LAYOUT_PROP_NAMES = [
  "p",
  "px",
  "py",
  "m",
  "mx",
  "my",
  "position",
  "overflow",
] as const;

export function splitLayoutProps<T extends Record<string, unknown> = Record<string, unknown>>(
  props?: T,
): { layout: Partial<LayoutProps>; rest: Omit<T, keyof LayoutProps> } {
  const layout: Partial<LayoutProps> = {};
  const rest: Record<string, unknown> = {};

  if (!props) return { layout, rest: rest as Omit<T, keyof LayoutProps> };

  const layoutPropKeys = LAYOUT_PROP_NAMES as unknown as (keyof LayoutProps)[];

  for (const key of Object.keys(props)) {
    if (layoutPropKeys.includes(key as keyof LayoutProps)) {
      layout[key as keyof LayoutProps] = (props as any)[key];
    } else {
      rest[key] = (props as any)[key];
    }
  }

  return { layout, rest: rest as Omit<T, keyof LayoutProps> };
}
