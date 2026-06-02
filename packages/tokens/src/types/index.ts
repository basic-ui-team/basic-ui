type ColorRampRole = "primary" | "secondary" | "accent" | "neutral";
type ColorRampShade =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

type SemanticRole = "bg" | "fg" | "surface" | "border";
type SemanticState =
  | "base"
  | "muted"
  | "hover"
  | "active"
  | "disabled"
  | "inverted"
  | "error"
  | "warning"
  | "success"
  | "info";

/** Spacing scale: xs (4px) to 5xl (64px) */
type SpacingTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

/** Border radius: from sharp (0px) to full (9999px) */
type RadiusTokens = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Shadow depth levels */
type ShadowTokens = "s1" | "s2" | "s3" | "s4" | "s5";

/** Font size scale */
type FontSizeTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

/** Font weight levels */
type FontWeightTokens = "normal" | "medium" | "semibold" | "bold";

/** Line height for text */
type LineHeightTokens = "tight" | "snug" | "normal" | "relaxed" | "loose";

/** Letter spacing (tracking) */
type LetterSpacingTokens = "tight" | "normal" | "wide";

/** Font family names (map to CSS custom props that hold the actual stack) */
type FontFamilyTokens = "sans" | "heading" | "mono";

/** Motion/animation durations */
type DurationTokens = "fast" | "normal" | "slow";

/** Animation easing functions */
type EasingTokens = "in" | "out" | "spring";

/** Stacking context (z-index) for overlays */
type ZIndexTokens = "dropdown" | "modal" | "toast" | "tooltip";

/** Breakpoints for responsive design */
type BreakpointTokens = "sm" | "md" | "lg" | "xl" | "2xl";

/** Container query breakpoints */
//  type ContainerTokens = "sm" | "md" | "lg" | "xl" | "max";

/** Opacity for various states */
type OpacityTokens = "base" | "muted" | "disabled" | "hover" | "overlay";

type RampColors = {
  [role in ColorRampRole]: Partial<Record<ColorRampShade, string>>; // use Partial Record to allow missing shades
};

type SemanticColors = {
  [role in SemanticRole]: Partial<Record<SemanticState, string>>; // use Partial Record to allow missing states
};

/**
 * Comprehensive theme configuration interface.
 * Each category is optional and can be partially defined.
 * This allows for flexible theming where only specific tokens need to be overridden.
 * The color category is further structured into ramps and semantic roles for clarity.
 * All properties ultimately map to CSS custom properties for use in styling.
 */
export interface ThemeConfig {
  color?: Partial<RampColors> & Partial<SemanticColors> & { white?: string; black?: string }; // Include base colors
  spacing?: Partial<Record<SpacingTokens, string>>;
  radius?: Partial<Record<RadiusTokens, string>>;
  shadow?: Partial<Record<ShadowTokens, string>>;
  fontSize?: Partial<Record<FontSizeTokens, string>>;
  fontWeight?: Partial<Record<FontWeightTokens, number | string>>;
  letterSpacing?: Partial<Record<LetterSpacingTokens, string>>;
  lineHeight?: Partial<Record<LineHeightTokens, number | string>>;
  fontFamily?: Partial<Record<FontFamilyTokens, string>>;
  duration?: Partial<Record<DurationTokens, string>>;
  easing?: Partial<Record<EasingTokens, string>>;
  zIndex?: Partial<Record<ZIndexTokens, number>>;
  breakpoint?: Partial<Record<BreakpointTokens, string>>;
  // container?: Partial<Record<ContainerTokens, string>>;
  opacity?: Partial<Record<OpacityTokens, string>>;
}
