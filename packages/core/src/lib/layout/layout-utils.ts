import LayoutProps, { SizingType, OverflowType, PositionType, SpacingType } from "./layout.types";
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

/**
 * Generates className for layout-related props with full responsive support.
 *
 * **Design Philosophy:**
 * - Only predefined sizing values (`"auto"`, `"full"`, `"fit"`, `"screen"`, etc.) are supported for consistency and bundle optimization.
 * - Responsive design is a first-class citizen: all sizing and spacing props support responsive breakpoints.
 * - For arbitrary Tailwind classes or custom CSS beyond the predefined variants, use the component's `className` and `style` props.
 *
 * @example
 * // Predefined variants—recommended for consistency
 * <Box h="full" w="fit" p="md" />
 *
 * // For arbitrary Tailwind classes, use className prop
 * <Box h="full" className="h-[custom-value]" />
 *
 * // For custom CSS, use style prop
 * <Box h="full" style={{ width: 'calc(100% - 20px)' }} />
 *
 * @param layout - Layout props object
 * @returns Object with `layoutClassNameString` containing all variant classes
 */
export const generateLayoutClassNames = (
  layout: LayoutProps,
): { layoutClassNameString: string } => {
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

  return {
    layoutClassNameString: cn(
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
        gap: gap as SpacingType,
        position: position as PositionType,
        overflow: overflow as OverflowType,
        overflowX: overflowX as OverflowType,
        overflowY: overflowY as OverflowType,
        height: h as SizingType,
        heightMin: hMin as SizingType,
        heightMax: hMax as SizingType,
        width: w as SizingType,
        widthMin: wMin as SizingType,
        widthMax: wMax as SizingType,
      }),
    ),
  };
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
