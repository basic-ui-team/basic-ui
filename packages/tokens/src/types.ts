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
  | "skeleton";


/** Border radius: from sharp (0px) to full (9999px) */
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Shadow depth levels */
export type ShadowToken = "s1" | "s2" | "s3" | "s4" | "s5";

/** Font size scale */
export type FontSizeTokens = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

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

/**
 * Semantic stacking layers.
 *
 * Local content uses base through docked. Global layers are reserved for
 * portalled and app-wide UI, ordered from dropdown through tooltip.
 */
export type ZIndexTokens =
  | "base"
  | "elevated"
  | "docked"
  | "dropdown"
  | "sticky"
  | "banner"
  | "overlay"
  | "modal"
  | "popover"
  | "toast"
  | "tooltip";

/** Breakpoints for responsive design */
export type BreakpointTokens = "sm" | "md" | "lg" | "xl" | "2xl";

/** Container query breakpoints */
//  export type ContainerTokens = "sm" | "md" | "lg" | "xl" | "max";

/** Opacity for various states */
export type OpacityTokens = "base" | "muted" | "disabled" | "hover" | "overlay";

export type RampColors = {
  [role in ColorRampRole]: Partial<Record<ColorRampShade, string>>; // use Partial Record to allow missing shades
};

export type SemanticColors = {
  [role in SemanticRole]: Partial<Record<SemanticState, string>>; // use Partial Record to allow missing states
};

/**
 * Comprehensive theme configuration interface.
 * Each category is optional and can be partially defined.
 * This allows for flexible theming where only specific tokens need to be overridden.
 * The color category is further structured into ramps and semantic roles for clarity.
 * All properties ultimately map to CSS custom properties for use in styling.
 */
export default interface ThemeConfig {
  color?: Partial<RampColors> & Partial<SemanticColors> & { white?: string; black?: string }; // Include base colors
  radius?: Partial<Record<RadiusToken, string>>;
  shadow?: Partial<Record<ShadowToken, string>>;
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
  opacity?: Partial<Record<OpacityTokens, string | number>>;
}

export type ResolvedTheme = ThemeConfig;

export type DeepPartial<T> = T extends object
  ? { [Key in keyof T]?: DeepPartial<T[Key]> }
  : T;

export type ThemeOverride = DeepPartial<ThemeConfig>;
