import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE_FAMILIES } from "../src/lib/colorRecipes/colorRecipes";

const __dirname = dirname(fileURLToPath(import.meta.url));

const tailwindFamilies = PALETTE_FAMILIES.filter(
  (family) => family !== "primary" && family !== "secondary",
);
const brandFamilies = ["primary", "secondary"] as const;

function extractColorVariables(css: string, families: readonly string[]): string[] {
  const pattern = new RegExp(
    `^\\s*(--color-(?:${families.join("|")})-\\d+):\\s*([^;]+);`,
    "gm",
  );
  return [...css.matchAll(pattern)].map((match) => `  ${match[1]}: ${match[2]};`);
}

/**
 * Builds the `@theme static` block that emits every supported palette family's
 * variables, so color recipes can reference any family/shade regardless of
 * utility usage (Tailwind tree-shakes unused `@theme` variables otherwise).
 * Tailwind default values come from the installed Tailwind theme (staying
 * version-synced); brand values come from the tokens generated theme.
 */
export function buildPaletteStaticTheme(): string {
  const require = createRequire(import.meta.url);
  const tailwindThemeCss = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8");
  const tokensThemeCss = readFileSync(
    resolve(__dirname, "../../tokens/src/generated/styles/theme.css"),
    "utf8",
  );
  const neutralVars = [
    ...extractColorVariables(tailwindThemeCss, tailwindFamilies),
    "  --color-white: #fff;",
    "  --color-black: #000;",
  ].sort();
  const brandVars = extractColorVariables(tokensThemeCss, brandFamilies).sort();

  // Fail fast if the registry drifts from the installed theme files.
  for (const family of tailwindFamilies) {
    if (!neutralVars.some((line) => line.includes(`--color-${family}-`))) {
      throw new Error(
        `Palette family "${family}" has no variables in the installed Tailwind theme.`,
      );
    }
  }
  for (const family of brandFamilies) {
    if (!brandVars.some((line) => line.includes(`--color-${family}-`))) {
      throw new Error(
        `Palette family "${family}" has no variables in the tokens generated theme.`,
      );
    }
  }

  return [`@theme static {`, ...neutralVars, ...brandVars, `}`].join("\n");
}
