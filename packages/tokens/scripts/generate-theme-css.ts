/**
 * Generate theme.css from TypeScript preset sources.
 * Run with: pnpm generate
 *
 * This script reads light.ts and dark.ts presets and writes
 * packages/tokens/src/styles/theme.css — the single CSS source of truth.
 */

import { lightTheme } from "../src/presets/light.js";
import { darkTheme } from "../src/presets/dark.js";
import { themeToCustomProperties } from "../src/utils/themeToCustomProperties.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type ThemeObj = Record<string, Record<string, string | number>>;

/** Primitive color prefixes that shouldn't be exported to CSS (they're only used internally) */
const PRIMITIVE_PREFIXES = ["--color-green-", "--color-purple-", "--color-gray-"];

/** Filter out primitive color tokens, keeping only semantic colors and other theme tokens */
function filterPrimitiveTokens(props: Record<string, string | number>): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(props).filter(
      ([varName]) => !PRIMITIVE_PREFIXES.some((prefix) => varName.startsWith(prefix)),
    ),
  );
}

/** Returns only the entries in dark that differ from light (for CSS overrides) */
function computeDarkDiff(
  lightProps: Record<string, string | number>,
  dark: ThemeObj,
): Record<string, string | number> {
  const darkProps = filterPrimitiveTokens(themeToCustomProperties(dark as any) as Record<string, string | number>);
  const diff: Record<string, string | number> = {};

  for (const [varName, value] of Object.entries(darkProps)) {
    if (lightProps[varName] !== value) {
      diff[varName] = value;
    }
  }
  return diff;
}

const light = lightTheme as unknown as ThemeObj;
const lightProps = filterPrimitiveTokens(themeToCustomProperties(light) as Record<string, string | number>);
const dark = darkTheme as unknown as ThemeObj;
const darkDiff = computeDarkDiff(lightProps, dark);

const lightCSSVars = Object.entries(lightProps)
  .map(([varName, value]) => `  ${varName}: ${value};`)
  .join("\n");

const darkCSSVars = Object.entries(darkDiff)
  .map(([varName, value]) => `  ${varName}: ${value};`)
  .join("\n");

const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate */

@import "tailwindcss";

@theme {
${lightCSSVars}
}

/* ===== DARK MODE OVERRIDES ===== */
.dark {
${darkCSSVars}
}
`;

const outPath = resolve(__dirname, "../src/styles/theme.css");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, "utf-8");

const relPath = relative(process.cwd(), outPath);
console.log(`✓ Generated ${relPath}`);
