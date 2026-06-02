// Ulitmately we need to build two things for consumers in this script:
// 1. A theme.css file with the @theme block for Tailwind CSS 4 (and dark mode overrides)
// 2. A theme.d.ts file with the TypeScript types for the theme tokens (for use in styled-components, vanilla CSS, etc.)

// For the CSS generation, we will:
// - Read the light and dark theme presets (light.ts and dark.ts)
// - Convert the theme objects to CSS custom properties
// - Write the resulting CSS to packages/tokens/src/styles/theme.css

// For the TypeScript types, we will:
// - Extract the keys from the theme objects to create a comprehensive type definition
// - Write the resulting types to packages/tokens/src/types/theme.d.ts
/**
 * Generate theme.css from TypeScript preset sources.
 * Run with: pnpm generate
 * This script reads light.ts and dark.ts presets and writes
 * packages/tokens/src/styles/theme.css with @theme block for Tailwind CSS 4.
 * Approach:
 * - Primitives (color ramps, spacing, etc.) defined in @theme
 * - Semantic tokens resolved to actual values (no var() in @theme for proper utility generation)
 * - Dark mode overrides in .dark selector
 * - Prefix utilities with "bui:" to prevent conflicts
 */

import { lightTheme } from "../src/themes/light";
import { darkTheme } from "../src/themes/dark";
import { TAILWIND_COLORS } from "../src/constants";
import { newThemeToCustomProperties } from "../src/utils/themeToCustomProperties";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

// NOTE: Can move this to utils so we can also use it in custom theme resolution at runtime.
function resolveVariableReference(
  value: string | number,
  allProps: Record<string, string | number>,
): string | number {
  // If it's not a string, return as is (e.g., numbers for fontWeight)
  if (typeof value !== "string") return value;

  // first check if it's a var() reference
  const varMatch = value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!varMatch) return value; // not a var() reference, return as is

  // it's a var() reference, extract the variable name
  const varName = varMatch[1];

  // Check if the variable name exists in our Tailwind colors mapping
  if (TAILWIND_COLORS[varName]) {
    return TAILWIND_COLORS[varName];
  }

  // if it doesn't, check if it exists in the theme properties and if not, return the original value and log a warning
  const resolvedValue = allProps[varName];
  if (resolvedValue === undefined) {
    console.warn(`⚠️  Cannot resolve ${varName}`);
    return value;
  }

  // if it resolves to another var() reference, recursively resolve it (handle nested references)
  return resolveVariableReference(resolvedValue, allProps);
}

function generateTheme() {
  const lightThemeObj = newThemeToCustomProperties(lightTheme);
  const darkThemeObj = newThemeToCustomProperties(darkTheme);

  const lightProps = lightThemeObj.customProperties;
  const darkProps = darkThemeObj.customProperties;

  // Resolve var() references in light theme properties
  const resolvedLightProps: Record<string, string | number> = {};
  Object.entries(lightProps).forEach(([key, value]) => {
    resolvedLightProps[key] = resolveVariableReference(value, lightProps);
  });

  // Resolve var() references in dark theme properties
  const resolvedDarkProps: Record<string, string | number> = {};
  Object.entries(darkProps).forEach(([key, value]) => {
    resolvedDarkProps[key] = resolveVariableReference(value, {
      ...resolvedLightProps,
      ...darkProps,
    });
  });

  // Generate CSS string for light theme
  const lightCSS = Object.entries(resolvedLightProps)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  // Generate CSS string for dark theme (only include overrides that differ from light theme)
  const darkCSS = Object.entries(resolvedDarkProps)
    .filter(([key, value]) => resolvedLightProps[key] !== value) // only include if different from light theme
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */

@import "tailwindcss";

/* ===== THEME CONFIGURATION ===== */
/* All design tokens with resolved values for Tailwind utility generation */
/* Utilities will be prefixed with "bui:" (e.g., bui:bg-background-primary) */
@theme {
${lightCSS}
}

/* ===== DARK MODE OVERRIDES ===== */
/* Apply these overrides when .dark class is present on html/body */
.dark {
${darkCSS}
}
`;

  // We will also write the resolved tokens to a TypeScript file for programmatic access (e.g., in styled-components, CVA variants, or vanilla CSS)
  const tokens = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */

export const tokens = ${JSON.stringify(lightThemeObj.tokens, null, 2)};

export const darkTokens = ${JSON.stringify(darkThemeObj.tokens, null, 2)}; // 
`;

  // write css file to packages/tokens/src/public/theme.css
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const outPath = resolve(__dirname, "../src/styles/theme.css");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, css, "utf-8");

  const relPath = relative(process.cwd(), outPath);
  console.log(`✓ Generated ${relPath}`);
}

generateTheme();
