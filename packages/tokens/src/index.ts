// Tokens package — Complete token system with themes and utilities
export const version = "0.2.1";

// Token objects
export { tokens, darkTokens } from "./generated/tokens";

// Types
export type {
  RampColors,
  SemanticColors,
  SpacingScaleConfig,
  SpacingScaleRounding,
  SpacingScaleUnit,
  SpacingStep,
  SpacingStepToken,
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

import type ThemeConfig from "./types";
export type { ThemeConfig };

// Core functions
export type { ThemeInput } from "./runtime/createTheme";

// Presets & Themes
import { lightTheme } from "./themes/light";
import { darkTheme } from "./themes/dark";
export { lightTheme, darkTheme };

// Utilities
export { createTheme } from "./runtime/createTheme";
export { mergeTheme } from "./runtime/mergeTheme";
export { themeToCSSVariables, type ThemeObj } from "./serialization/themeToCSSVariables";
export {
  DEFAULT_SPACING_SCALE,
  resolveSpacingScale,
  validateSpacingScale,
  type ResolvedSpacingScale,
} from "./scales/spacing";
export { PREFIX_MAP } from "./constants";
