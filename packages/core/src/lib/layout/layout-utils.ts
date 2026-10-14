import LayoutProps from "./layout.types";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import layoutVariants, { layoutVariantsConfig } from "./layout.variants";

export const layoutPropVariants = {
  p: "padding",
  px: "paddingX",
  py: "paddingY",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  pl: "paddingLeft",

  m: "margin",
  mx: "marginX",
  my: "marginY",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  ml: "marginLeft",

  gap: "gap",

  h: "height",
  hMin: "heightMin",
  hMax: "heightMax",
  w: "width",
  wMin: "widthMin",
  wMax: "widthMax",

  display: "display",
  position: "position",
  overflow: "overflow",
  overflowX: "overflowX",
  overflowY: "overflowY",
} as const satisfies Record<keyof LayoutProps, keyof typeof layoutVariantsConfig.variants>;

export type LayoutPropName = keyof typeof layoutPropVariants;

export const LAYOUT_PROP_NAMES = Object.keys(layoutPropVariants) as LayoutPropName[];

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
 * <Box h="full" w="fit" p={3} />
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
  return {
    layoutClassNameString: cn(
      getResponsiveClassNames(layout.p, (value) => layoutVariants({ padding: value })),
      getResponsiveClassNames(layout.px, (value) => layoutVariants({ paddingX: value })),
      getResponsiveClassNames(layout.py, (value) => layoutVariants({ paddingY: value })),
      getResponsiveClassNames(layout.pt, (value) => layoutVariants({ paddingTop: value })),
      getResponsiveClassNames(layout.pr, (value) => layoutVariants({ paddingRight: value })),
      getResponsiveClassNames(layout.pb, (value) => layoutVariants({ paddingBottom: value })),
      getResponsiveClassNames(layout.pl, (value) => layoutVariants({ paddingLeft: value })),
      getResponsiveClassNames(layout.m, (value) => layoutVariants({ margin: value })),
      getResponsiveClassNames(layout.mx, (value) => layoutVariants({ marginX: value })),
      getResponsiveClassNames(layout.my, (value) => layoutVariants({ marginY: value })),
      getResponsiveClassNames(layout.mt, (value) => layoutVariants({ marginTop: value })),
      getResponsiveClassNames(layout.mr, (value) => layoutVariants({ marginRight: value })),
      getResponsiveClassNames(layout.mb, (value) => layoutVariants({ marginBottom: value })),
      getResponsiveClassNames(layout.ml, (value) => layoutVariants({ marginLeft: value })),
      getResponsiveClassNames(layout.gap, (value) => layoutVariants({ gap: value })),
      getResponsiveClassNames(layout.h, (value) => layoutVariants({ height: value })),
      getResponsiveClassNames(layout.hMin, (value) => layoutVariants({ heightMin: value })),
      getResponsiveClassNames(layout.hMax, (value) => layoutVariants({ heightMax: value })),
      getResponsiveClassNames(layout.w, (value) => layoutVariants({ width: value })),
      getResponsiveClassNames(layout.wMin, (value) => layoutVariants({ widthMin: value })),
      getResponsiveClassNames(layout.wMax, (value) => layoutVariants({ widthMax: value })),
      getResponsiveClassNames(layout.display, (value) => layoutVariants({ display: value })),
      getResponsiveClassNames(layout.position, (value) => layoutVariants({ position: value })),
      getResponsiveClassNames(layout.overflow, (value) => layoutVariants({ overflow: value })),
      getResponsiveClassNames(layout.overflowX, (value) => layoutVariants({ overflowX: value })),
      getResponsiveClassNames(layout.overflowY, (value) => layoutVariants({ overflowY: value })),
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
