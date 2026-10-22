import { lightTheme } from "../src/themes/light";
import { darkTheme } from "../src/themes/dark";
import { resolveTheme } from "../src/runtime/resolveTheme";
import { themeToCSSVariables } from "../src/serialization/themeToCSSVariables";
import {
  BRAND_PALETTE_FAMILIES,
  TAILWIND_PALETTE_FAMILIES,
} from "../src/palette";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
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

  // if it doesn't, check if it exists in the theme properties and if not, return the original value and log a warning
  const resolvedValue = allProps[varName];
  if (resolvedValue === undefined) {
    console.warn(
      `⚠️  Cannot resolve ${varName}. This might be because it is not defined or because it is a built-in tailwind color that is not included in the theme properties. Returning original value: ${value}`,
    );
    return value;
  }

  // if it resolves to another var() reference, recursively resolve it (handle nested references)
  return resolveVariableReference(resolvedValue, allProps);
}

function generateTheme() {
  const lightThemeObj = themeToCSSVariables(resolveTheme(lightTheme));
  const darkThemeObj = themeToCSSVariables(resolveTheme(darkTheme));

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
  // Tailwind's base spacing multiplier, matching its default: every bare
  // numeric utility (p-2, p-0.5, p-12, anything authored in className)
  // resolves to calc(var(--spacing) * N). The design system adopts
  // Tailwind's linear scale rather than maintaining a custom one.
  const lightCSS = [
    `  --spacing: 0.25rem;`,
    ...Object.entries(resolvedLightProps).map(([key, value]) => `  ${key}: ${value};`),
  ].join("\n");

  // Generate CSS string for dark theme (only include overrides that differ from light theme)
  const darkCSS = Object.entries(resolvedDarkProps)
    .filter(([key, value]) => resolvedLightProps[key] !== value) // only include if different from light theme
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */

@import "tailwindcss";
/* Dark mode is class-based (apps toggle .dark on <html>). Without this,
   Tailwind's dark: variant follows the OS preference instead. */
@custom-variant dark (&:where(.dark, .dark *));


/* ===== THEME CONFIGURATION ===== */
/* All design tokens with resolved values for Tailwind utility generation */
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

  // Write generated artifacts to src/generated.
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const baseOutPath = resolve(__dirname, "../src/generated");
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

}

generateTheme();

/**
 * Emits the full palette as `@theme static` variables. Color recipes in
 * downstream packages reference any palette family/shade at runtime through
 * `var(--color-<family>-<shade>)`, and Tailwind tree-shakes unused `@theme`
 * variables — so the palette must be emitted regardless of utility usage.
 *
 * Neutral families come from the installed Tailwind theme (staying
 * version-synced); the brand families come from this package's generated
 * theme. Authored here so downstream packages consume tokens instead of
 * re-deriving values.
 */
function generatePaletteStaticTheme() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const require = createRequire(import.meta.url);
  const tailwindThemeCss = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8");
  const tokensThemeCss = readFileSync(
    resolve(__dirname, "../src/generated/styles/theme.css"),
    "utf8",
  );

  const shaded = /^ {2}(--color-[a-z]+-\d+): ([^;]+);$/gm;
  const collectShaded = (css: string, families?: readonly string[]) =>
    [...css.matchAll(shaded)]
      .map((match) => `  ${match[1]}: ${match[2]};`)
      .filter((line) =>
        families === undefined ? true : families.some((family) => line.includes(`--color-${family}-`)),
      )
      .sort();

  const neutralVars = collectShaded(tailwindThemeCss, TAILWIND_PALETTE_FAMILIES);
  neutralVars.push("  --color-white: #fff;", "  --color-black: #000;");
  const brandVars = collectShaded(tokensThemeCss, BRAND_PALETTE_FAMILIES);

  // Fail fast if the registry drifts from the installed theme files.
  for (const family of TAILWIND_PALETTE_FAMILIES) {
    if (!neutralVars.some((line) => line.includes(`--color-${family}-`))) {
      throw new Error(`Palette family "${family}" has no variables in the installed Tailwind theme.`);
    }
  }
  for (const family of BRAND_PALETTE_FAMILIES) {
    if (!brandVars.some((line) => line.includes(`--color-${family}-`))) {
      throw new Error(`Palette family "${family}" has no variables in the generated tokens theme.`);
    }
  }

  const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate. */

/* Always-on palette variables: recipes reference any family/shade at runtime,
   and Tailwind tree-shakes unused @theme variables. */
@theme static {
${[...neutralVars, ...brandVars].join("\n")}
}
`;
  const outPath = resolve(__dirname, "../src/generated/styles/palette-static.css");
  writeFileSync(outPath, css, "utf-8");
  console.log(`✓ Generated ${relative(process.cwd(), outPath)}`);
}

generatePaletteStaticTheme();
