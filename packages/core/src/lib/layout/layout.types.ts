import { ResponsiveValue } from "@basic-ui/react-utilities";

export const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type SpacingStep = (typeof spacingSteps)[number];

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
 * <Box p={{ base: 2, md: 4, lg: 5 }} h={{ base: 'auto', md: 'full' }} />
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
  p?: ResponsiveValue<SpacingStep | "unset">;
  px?: ResponsiveValue<SpacingStep | "unset">;
  py?: ResponsiveValue<SpacingStep | "unset">;
  pt?: ResponsiveValue<SpacingStep | "unset">;
  pr?: ResponsiveValue<SpacingStep | "unset">;
  pb?: ResponsiveValue<SpacingStep | "unset">;
  pl?: ResponsiveValue<SpacingStep | "unset">;

  m?: ResponsiveValue<SpacingStep | "unset">;
  mx?: ResponsiveValue<SpacingStep | "unset">;
  my?: ResponsiveValue<SpacingStep | "unset">;
  mt?: ResponsiveValue<SpacingStep | "unset">;
  mr?: ResponsiveValue<SpacingStep | "unset">;
  mb?: ResponsiveValue<SpacingStep | "unset">;
  ml?: ResponsiveValue<SpacingStep | "unset">;

  gap?: ResponsiveValue<SpacingStep | "unset">;

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
