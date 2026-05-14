// Tokens package — Complete token system with themes and utilities
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
  // ContainerTokens,
  BreakpointTokens,
  OpacityTokens,
} from "./types";

// Core functions
import { createTheme } from "./createTheme";
export { createTheme };
export type { ThemeInput } from "./createTheme";

// Presets & Themes
import { lightTheme, darkTheme } from "./presets";
export { lightTheme, darkTheme };

// Utilities
export { mergeTheme, themeToCustomProperties } from "./utils"; // cssVar and tokenName are now internal utilities, not exported
export { PREFIX_MAP } from "./constants";