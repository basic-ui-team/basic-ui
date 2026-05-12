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
import { createTheme } from "./createTheme";
export { createTheme };
export type { ThemeInput } from "./createTheme";

// Presets & Themes
import { lightTheme, darkTheme } from "./presets";
export { lightTheme, darkTheme };

// Utilities
export { mergeTheme, extractTokens, tokenName, cssVar } from "./utils";
export { PREFIX_MAP } from "./constants";

// Tailwind integration
export { default as preset } from "./tailwind/preset";

// Auto-initialize light theme on module load (browser environment only)
if (typeof document !== "undefined") {
  createTheme({ light: lightTheme });
}
