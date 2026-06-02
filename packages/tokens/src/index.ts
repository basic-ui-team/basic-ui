// Tokens package — Complete token system with themes and utilities
export const version = "0.2.1";

// Token objects
export { tokens, darkTokens } from "./pkg/tokens";

// Types
export type {
  RampColors,
  SemanticColors,
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
} from "./types/index";

import type ThemeConfig from "./types/index";
export type { ThemeConfig };

// Core functions
export type { ThemeInput } from "./utils/createTheme";

// Presets & Themes
import { lightTheme, darkTheme } from "./themes";
export { lightTheme, darkTheme };

// Utilities
export { mergeTheme, themeToCSSVariables, createTheme, type ThemeObj } from "./utils";
export { PREFIX_MAP } from "./constants";
