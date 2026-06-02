import { lightTheme } from "../src/themes/light";
import { darkTheme } from "../src/themes/dark";
import { TAILWIND_COLORS } from "../src/constants";
import { themeToCSSVariables } from "../src/utils/themeToCSSVariables";
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
  const lightThemeObj = themeToCSSVariables(lightTheme);
  const darkThemeObj = themeToCSSVariables(darkTheme);

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
/**
 * Exported tokens that map to the tailwind theme variable names for use in programmatic contexts.
 *
 * E.g., tokens.color.bg.base → "bg-base" which can be used in tailwind classes in variant files like: "bg-(tokens.color.bg.base)" which resolves to "bg-bg-base" and then to the actual color value in the theme.
 * This allows us to maintain a single source of truth for token names that can be used both in CSS and in JS/TS contexts without hardcoding strings.
 */

export const tokens = ${JSON.stringify(lightThemeObj.tokens, null, 2)};

export const darkTokens = ${JSON.stringify(darkThemeObj.tokens, null, 2)};
`;

  // Write generated CSS to src/pkg (new generated artifacts location)
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const baseOutPath = resolve(__dirname, "../src/pkg");
  mkdirSync(baseOutPath, { recursive: true });

  const cssOutPath = resolve(baseOutPath, "styles/theme.css");
  mkdirSync(dirname(cssOutPath), { recursive: true });
  writeFileSync(cssOutPath, css, "utf-8");

  const relPath = relative(process.cwd(), cssOutPath);
  console.log(`✓ Generated ${relPath}`);
  const tokensOutPath = resolve(baseOutPath, "tokens.ts");
  writeFileSync(tokensOutPath, tokens, "utf-8");
  const relTokensPath = relative(process.cwd(), tokensOutPath);
  console.log(`✓ Generated ${relTokensPath}`);

  // we generate an index.ts file that re-exports the tokens for easier imports in other packages
  const indexOutPath = resolve(baseOutPath, "index.ts");
  const indexContent = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */
export { tokens, darkTokens } from "./tokens";
`;
  writeFileSync(indexOutPath, indexContent, "utf-8");
  const relIndexPath = relative(process.cwd(), indexOutPath);
  console.log(`✓ Generated ${relIndexPath}`);
}

generateTheme();
