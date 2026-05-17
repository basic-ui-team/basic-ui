export type SemanticColorTokens =
  // Primitives: Primary ramp
  | "primary-50"
  | "primary-100"
  | "primary-200"
  | "primary-300"
  | "primary-400"
  | "primary-500"
  | "primary-600"
  | "primary-700"
  | "primary-800"
  | "primary-900"
  // Primitives: Secondary ramp
  | "secondary-50"
  | "secondary-100"
  | "secondary-200"
  | "secondary-300"
  | "secondary-400"
  | "secondary-500"
  | "secondary-600"
  | "secondary-700"
  | "secondary-800"
  | "secondary-900"
  // Primitives: Accent ramp
  | "accent-50"
  | "accent-100"
  | "accent-200"
  | "accent-300"
  | "accent-400"
  | "accent-500"
  | "accent-600"
  | "accent-700"
  | "accent-800"
  | "accent-900"
  // Primitives: Neutral ramp
  | "neutral-50"
  | "neutral-100"
  | "neutral-200"
  | "neutral-300"
  | "neutral-400"
  | "neutral-500"
  | "neutral-600"
  | "neutral-700"
  | "neutral-800"
  | "neutral-900"
  // Semantic: Backgrounds & surfaces
  | "background-primary"
  | "background-secondary"
  | "background-muted"
  | "surface"
  | "surface-hover"
  | "surface-active"
  // Semantic: Text/foreground
  | "foreground-primary"
  | "foreground-secondary"
  | "foreground-muted"
  | "foreground-link"
  // Semantic: Borders
  | "border-base"
  | "border-muted"
  // Semantic: Feedback colors
  | "success"
  | "success-light"
  | "warning"
  | "warning-light"
  | "error"
  | "error-light"
  | "info"
  | "info-light"
  // Semantic: Skeleton & Loading
  | "skeleton";

/** Spacing scale: xs (4px) to 5xl (64px) */
export type SpacingTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

/** Border radius: from sharp (0px) to full (9999px) */
export type RadiusTokens = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Shadow depth levels */
export type ShadowTokens = "s1" | "s2" | "s3" | "s4" | "s5";

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

/** Breakpoints for responsive design */
export type BreakpointTokens = "sm" | "md" | "lg" | "xl" | "2xl";

/** Container query breakpoints */
// export type ContainerTokens = "sm" | "md" | "lg" | "xl" | "max";

/** Opacity for disabled/muted states */
export type OpacityTokens = "disabled" | "muted";

/**
 * Complete theme configuration.
 * All properties are optional — only override what you need.
 * Defaults will be provided by the library.
 */
export interface ThemeConfig {
  color?: Partial<Record<SemanticColorTokens, string>>;
  fontFamily?: Partial<Record<FontFamilyTokens, string>>;
  fontSize?: Partial<Record<FontSizeTokens, string>>;
  fontWeight?: Partial<Record<FontWeightTokens, number | string>>;
  letterSpacing?: Partial<Record<LetterSpacingTokens, string>>;
  lineHeight?: Partial<Record<LineHeightTokens, number | string>>;
  breakpoint?: Partial<Record<BreakpointTokens, string>>;
  // container?: Partial<Record<ContainerTokens, string>>;
  spacing?: Partial<Record<SpacingTokens, string>>;
  radius?: Partial<Record<RadiusTokens, string>>;
  shadow?: Partial<Record<ShadowTokens, string>>;
  easing?: Partial<Record<EasingTokens, string>>;
  duration?: Partial<Record<DurationTokens, string>>;
  zIndex?: Partial<Record<ZIndexTokens, number>>;
  opacity?: Partial<Record<OpacityTokens, number | string>>;
}
