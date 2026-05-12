// Tokens package — Complete token system with themes, utilities, and Tailwind preset
export const version = "0.0.1";

// Types
export type {
  ThemeConfig,
  SemanticColorTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  FontSizeTokens,
  FontWeightTokens,
  LineHeightTokens,
  LetterSpacingTokens,
  FontFamilyTokens,
  DurationTokens,
  EasingTokens,
  ZIndexTokens,
  ContainerTokens,
  OpacityTokens,
} from "./types";

// Core functions
export { createTheme } from "./createTheme";

// Presets & Themes
export { lightTheme, darkTheme } from "./presets";
export { defaultTheme } from "./config/default";

// Utilities
export { mergeTheme, extractTokens, tokenName, cssVar } from "./utils";

// Tailwind integration
export { default as preset } from "./tailwind/preset";

