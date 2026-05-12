export type SemanticColorTokens =
  // Primitives: Green ramp
  | "green-50"
  | "green-100"
  | "green-200"
  | "green-300"
  | "green-400"
  | "green-500"
  | "green-600"
  | "green-700"
  | "green-800"
  | "green-900"
  // Primitives: Purple ramp
  | "purple-50"
  | "purple-100"
  | "purple-200"
  | "purple-300"
  | "purple-400"
  | "purple-500"
  | "purple-600"
  | "purple-700"
  // Primitives: Gray ramp
  | "gray-50"
  | "gray-100"
  | "gray-200"
  | "gray-300"
  | "gray-400"
  | "gray-500"
  | "gray-600"
  | "gray-700"
  | "gray-800"
  | "gray-900"
  // Semantic: Backgrounds & surfaces
  | "bg"
  | "surface"
  | "surface-hover"
  | "surface-active"
  | "muted-bg"
  | "secondary-bg"
  // Semantic: Primary & Secondary
  | "foreground"
  | "primary"
  | "primary-hover"
  | "primary-active"
  | "primary-light"
  | "primary-foreground"
  | "secondary"
  | "secondary-hover"
  | "secondary-active"
  | "secondary-light"
  | "secondary-foreground"
  // Semantic: Text
  | "text"
  | "text-secondary"
  | "text-muted"
  | "text-light"
  | "text-dark"
  | "text-link"
  | "text-feedback"
  // Semantic: Borders
  | "border"
  | "border-muted"
  // Semantic: Feedback colors
  | "success"
  | "success-light"
  | "success-foreground"
  | "warning"
  | "warning-light"
  | "warning-foreground"
  | "error"
  | "error-light"
  | "error-foreground"
  | "info"
  | "info-light"
  | "info-foreground"
  // Semantic: Skeleton & Loading
  | "skeleton";

/** Spacing scale: xs (4px) to 5xl (64px) */
export type SpacingTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

/** Border radius: from sharp (0px) to full (9999px) */
export type RadiusTokens = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Shadow depth levels */
export type ShadowTokens = "sm" | "md" | "lg" | "xl" | "2xl";

/** Font size scale */
export type FontSizeTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

/** Font weight levels */
export type FontWeightTokens = "normal" | "medium" | "semibold" | "bold";

/** Line height for text */
export type LineHeightTokens = "tight" | "snug" | "normal" | "relaxed" | "loose";

/** Letter spacing (tracking) */
export type LetterSpacingTokens = "tight" | "normal" | "wide";

/** Font family names (map to CSS custom props that hold the actual stack) */
export type FontFamilyTokens = "sans" | "heading" | "mono";

/** Motion/animation durations */
export type DurationTokens = "fast" | "normal" | "slow";

/** Animation easing functions */
export type EasingTokens = "in" | "out" | "spring";

/** Stacking context (z-index) for overlays */
export type ZIndexTokens = "dropdown" | "modal" | "toast" | "tooltip";

/** Breakpoint query breakpoints */
export type ContainerTokens = "sm" | "md" | "lg" | "xl" | "max";

/** Opacity for disabled/muted states */
export type OpacityTokens = "disabled" | "muted";

/**
 * Complete theme configuration.
 * All properties are optional — only override what you need.
 * Defaults will be provided by the library.
 */
export interface ThemeConfig {
  colors?: Partial<Record<SemanticColorTokens, string>>;
  spacing?: Partial<Record<SpacingTokens, string>>;
  radius?: Partial<Record<RadiusTokens, string>>;
  shadows?: Partial<Record<ShadowTokens, string>>;
  fontSize?: Partial<Record<FontSizeTokens, string>>;
  fontWeight?: Partial<Record<FontWeightTokens, number | string>>;
  lineHeight?: Partial<Record<LineHeightTokens, number | string>>;
  letterSpacing?: Partial<Record<LetterSpacingTokens, string>>;
  fontFamily?: Partial<Record<FontFamilyTokens, string>>;
  duration?: Partial<Record<DurationTokens, string>>;
  easing?: Partial<Record<EasingTokens, string>>;
  zIndex?: Partial<Record<ZIndexTokens, number>>;
  breakpoint?: Partial<Record<ContainerTokens, string>>;
  opacity?: Partial<Record<OpacityTokens, number | string>>;
}
