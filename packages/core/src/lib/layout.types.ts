import { ResponsiveValue } from "@basic-ui/react-utilities";

/**
 * Spacing values use Tailwind's numeric spacing scale: every value is a
 * multiple of the theme's `--spacing`. The values below are the guaranteed
 * range — whole steps 0 to 12 plus the fractional steps up to 3.5 — the
 * shipped stylesheet safelists CSS for each of these at every breakpoint.
 * Values outside this range still type-check but only generate CSS when the
 * consumer's build discovers them. Fractional steps above 3.5 are deliberately
 * not guaranteed: they are unused by the library and cost ~5 KB gzipped CSS.
 */
export const spacingSteps = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4,
  5, 6, 7, 8, 9, 10, 11, 12,
] as const;
export type SpacingStep = number;

export const SizingValues = ["auto", "full", "min", "max", "fit", "screen"] as const;
export type SizingType = (typeof SizingValues)[number];
export type MaxSizingType = Exclude<SizingType, "auto"> | "none";

export type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";

export type DisplayType = "block" | "inline" | "inline-block" | "none";

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
 * - Maximum dimensions use `"none"` instead of `"auto"` to remove a constraint
 * - For arbitrary Tailwind classes or custom CSS, use the component's `className` or `style` props instead
 *
 * **Spacing Props (p, m, gap, etc.):**
 * - Accept Tailwind numeric spacing values (multiples of the theme's `--spacing`)
 * - `spacingSteps` lists the guaranteed range; all spacing is responsive
 */
export interface LayoutProps {
  p?: ResponsiveValue<SpacingStep>;
  px?: ResponsiveValue<SpacingStep>;
  py?: ResponsiveValue<SpacingStep>;
  pt?: ResponsiveValue<SpacingStep>;
  pr?: ResponsiveValue<SpacingStep>;
  pb?: ResponsiveValue<SpacingStep>;
  pl?: ResponsiveValue<SpacingStep>;

  m?: ResponsiveValue<SpacingStep>;
  mx?: ResponsiveValue<SpacingStep>;
  my?: ResponsiveValue<SpacingStep>;
  mt?: ResponsiveValue<SpacingStep>;
  mr?: ResponsiveValue<SpacingStep>;
  mb?: ResponsiveValue<SpacingStep>;
  ml?: ResponsiveValue<SpacingStep>;

  gap?: ResponsiveValue<SpacingStep>;
  gapX?: ResponsiveValue<SpacingStep>;
  gapY?: ResponsiveValue<SpacingStep>;

  h?: ResponsiveValue<SizingType>;
  hMin?: ResponsiveValue<SizingType>;
  hMax?: ResponsiveValue<MaxSizingType>;
  w?: ResponsiveValue<SizingType>;
  wMin?: ResponsiveValue<SizingType>;
  wMax?: ResponsiveValue<MaxSizingType>;

  position?: ResponsiveValue<PositionType>;
  display?: ResponsiveValue<DisplayType>;

  overflow?: ResponsiveValue<OverflowType>;
  overflowX?: ResponsiveValue<OverflowType>;
  overflowY?: ResponsiveValue<OverflowType>;
}

export default LayoutProps;
