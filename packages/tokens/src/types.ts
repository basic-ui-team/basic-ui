export type SemanticColorTokens =
  | "bg"
  | "surface"
  | "surface-hover"
  | "surface-active"
  | "muted-bg"
  | "secondary-bg"
  // Primary & Secondary
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
  // Text
  | "text"
  | "text-secondary"
  | "text-light"
  | "text-dark"
  | "text-link"
  | "text-feedback"
  // Borders
  | "border"
  | "border-muted"
  // Feedback (semantic)
  | "success"
  | "success-light"
  | "warning"
  | "warning-light"
  | "error"
  | "error-light"
  | "info"
  | "info-light"
  // Skeleton & Loading
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

/** Container query breakpoints */
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
  container?: Partial<Record<ContainerTokens, string>>;
  opacity?: Partial<Record<OpacityTokens, number | string>>;
}
