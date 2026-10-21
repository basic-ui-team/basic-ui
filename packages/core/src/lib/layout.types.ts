import { ResponsiveValue } from "@basic-ui/react-utilities";

/**
 * Spacing values use the design system's 9-point token scale, backed by the
 * `--spacing-0..9` theme variables. Values outside the scale — fractionals
 * like `p-1.5`, or steps beyond 9 — are a `className` concern: the theme's
 * base `--spacing` token makes every bare numeric utility resolve through
 * Tailwind's `calc(var(--spacing) * N)` fallback, discovered by the
 * consumer's own scanner.
 */
export const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type SpacingStep = (typeof spacingSteps)[number];

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
 * - Accept the 9-point tokenized spacing scale for consistent spacing across components
 * - All spacing is responsive; fractionals and steps beyond 9 go through `className`
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
