// Theme authoring types
export type {
  RampColors,
  SemanticColors,
  ThemeOverride,
  RadiusToken,
  ShadowToken,
  FontSizeTokens,
  FontWeightTokens,
  LineHeightTokens,
  LetterSpacingTokens,
  FontFamilyTokens,
  DurationTokens,
  EasingTokens,
  ZIndexTokens,
  // ContainerTokens,
  BreakpointTokens,
  OpacityTokens,
} from "./types";

export type { default as ThemeConfig } from "./types";

// Theme application
export type { ThemeInput } from "./runtime/createTheme";
export { createTheme } from "./runtime/createTheme";
export { mergeTheme } from "./runtime/mergeTheme";

// Theme presets and scale defaults
export { lightTheme } from "./themes/light";
export { darkTheme } from "./themes/dark";

// Palette registry
export {
  PALETTE_FAMILIES,
  TAILWIND_PALETTE_FAMILIES,
  BRAND_PALETTE_FAMILIES,
  type PaletteColor,
} from "./palette";
