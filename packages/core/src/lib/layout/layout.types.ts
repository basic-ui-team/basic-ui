import { ResponsiveValue } from "@core/hooks";

export const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SpacingType = (typeof spacingValues)[number];

export const SizingValues = ["unset", "auto", "full", "min", "max", "fit", "screen"] as const;
export type SizingType = (typeof SizingValues)[number];

export type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";

export type OverflowType = "visible" | "hidden" | "auto" | "scroll";

/**
 * Layout props for responsive spacing, sizing, positioning, and overflow control.
 *
 * **Responsive Support:**
 * All props accept ResponsiveValue<T> for breakpoint-specific styling:
 * ```tsx
 * <Box p={{ base: 'sm', md: 'lg', lg: 'xl' }} h={{ base: 'auto', md: 'full' }} />
 * ```
 *
 * **Sizing Props (h, w, hMin, hMax, wMin, wMax):**
 * - Accept predefined tokenized values (`"auto"`, `"full"`, `"fit"`, `"screen"`, etc.) for consistency
 * - For arbitrary Tailwind classes or custom CSS, use the component's `className` or `style` props instead
 *
 * **Spacing Props (p, m, gap, etc.):**
 * - Accept tokenized spacing values for consistent spacing across components
 * - All spacing is responsive
 */
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

  h?: ResponsiveValue<SizingType>;
  hMin?: ResponsiveValue<SizingType>;
  hMax?: ResponsiveValue<SizingType>;
  w?: ResponsiveValue<SizingType>;
  wMin?: ResponsiveValue<SizingType>;
  wMax?: ResponsiveValue<SizingType>;

  position?: ResponsiveValue<PositionType>;

  overflow?: ResponsiveValue<OverflowType | "unset">;
  overflowX?: ResponsiveValue<OverflowType | "unset">;
  overflowY?: ResponsiveValue<OverflowType | "unset">;
}

export default LayoutProps;
