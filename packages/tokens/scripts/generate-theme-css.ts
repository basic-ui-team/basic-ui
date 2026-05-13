/**
 * Generate theme.css from TypeScript preset sources.
 * Run with: pnpm generate
 *
 * This script reads light.ts and dark.ts presets and writes
 * packages/tokens/src/styles/theme.css with @theme block for Tailwind CSS 4.
 * 
 * Approach:
 * - Primitives (color ramps, spacing, etc.) defined in @theme
 * - Semantic tokens resolved to actual values (no var() in @theme for proper utility generation)
 * - Dark mode overrides in .dark selector
 * - Prefix utilities with "bui:" to prevent conflicts
 */

import { lightTheme } from "../src/presets/light.ts";
import { darkTheme } from "../src/presets/dark.ts";
import { themeToCustomProperties } from "../src/utils/themeToCustomProperties.ts";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type ThemeObj = Record<string, Record<string, string | number>>;

/** Tailwind's built-in color palette (subset we use) */
const TAILWIND_COLORS: Record<string, string> = {
  "--color-red-300": "oklch(80.8% .114 19.571)",
  "--color-red-400": "oklch(70.4% .191 22.216)",
  "--color-red-500": "oklch(63.7% .237 25.331)",
  "--color-red-900": "oklch(39.6% .141 25.723)",
  "--color-green-300": "oklch(87.1% .15 154.449)",
  "--color-green-400": "oklch(79.2% .209 151.711)",
  "--color-green-500": "oklch(72.3% .219 149.579)",
  "--color-green-900": "oklch(39.3% .095 152.535)",
  "--color-yellow-300": "oklch(90.5% .182 98.111)",
  "--color-yellow-400": "oklch(85.2% .199 91.936)",
  "--color-yellow-500": "oklch(79.5% .184 86.047)",
  "--color-yellow-900": "oklch(42.1% .095 57.708)",
  "--color-blue-300": "oklch(80.9% .105 251.813)",
  "--color-blue-400": "oklch(70.7% .165 254.624)",
  "--color-blue-500": "oklch(62.3% .214 259.815)",
  "--color-blue-900": "oklch(37.9% .146 265.522)",
  // Non-prefixed variants (for backward compatibility)
  "--green-900": "oklch(39.3% .095 152.535)",
};

/** 
 * Resolves var() references to actual values.
 * E.g., "var(--neutral-50)" -> "hsl(210 20% 97%)"
 */
function resolveVarReferences(
  value: string | number,
  allProps: Record<string, string | number>
): string | number {
  if (typeof value !== "string") return value;

  const varMatch = value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!varMatch) return value;

  const refName = varMatch[1];

  // Check Tailwind built-in colors first
  if (TAILWIND_COLORS[refName]) {
    return TAILWIND_COLORS[refName];
  }

  // Resolve from our primitives
  const resolvedValue = allProps[refName];
  if (resolvedValue === undefined) {
    console.warn(`⚠️  Cannot resolve ${refName}`);
    return value;
  }

  // Recursively resolve if the resolved value is also a var()
  return resolveVarReferences(resolvedValue, allProps);
}

const light = lightTheme as unknown as ThemeObj;
const lightProps = themeToCustomProperties(light) as Record<string, string | number>;
const dark = darkTheme as unknown as ThemeObj;
const darkPropsRaw = themeToCustomProperties(dark as any) as Record<string, string | number>;

// Resolve all var() references in light theme
const resolvedLightProps: Record<string, string | number> = {};
for (const [varName, value] of Object.entries(lightProps)) {
  resolvedLightProps[varName] = resolveVarReferences(value, lightProps);
}

// Resolve all var() references in dark theme and compute diff
const resolvedDarkProps: Record<string, string | number> = {};
for (const [varName, value] of Object.entries(darkPropsRaw)) {
  const resolved = resolveVarReferences(value, { ...lightProps, ...darkPropsRaw });
  if (resolvedLightProps[varName] !== resolved) {
    resolvedDarkProps[varName] = resolved;
  }
}

const themeCSSVars = Object.entries(resolvedLightProps)
  .map(([varName, value]) => `  ${varName}: ${value};`)
  .join("\n");

const darkCSSVars = Object.entries(resolvedDarkProps)
  .map(([varName, value]) => `  ${varName}: ${value};`)
  .join("\n");

const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */

@import "tailwindcss";

/* ===== THEME CONFIGURATION ===== */
/* All design tokens with resolved values for Tailwind utility generation */
/* Utilities will be prefixed with "bui:" (e.g., bui:bg-background-primary) */
@theme {
${themeCSSVars}
}

/* ===== DARK MODE OVERRIDES ===== */
/* Apply these overrides when .dark class is present on html/body */
.dark {
${darkCSSVars}
}
`;

const outPath = resolve(__dirname, "../src/styles/theme.css");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, "utf-8");

const relPath = relative(process.cwd(), outPath);
console.log(`✓ Generated ${relPath}`);
