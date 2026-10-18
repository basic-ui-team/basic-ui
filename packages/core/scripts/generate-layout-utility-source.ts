import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import { colorRecipeUtilityCandidates, PALETTE_FAMILIES } from "../src/lib/colorRecipes/colorRecipes";
import {
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  responsiveUtilities,
} from "../src/lib/responsive-utilities";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/layout-utilities.generated.css");
// Emit the palette ramps as static theme variables so color recipes can
// reference any supported family/shade regardless of utility usage.
// Tailwind default values come from the installed Tailwind theme (staying
// version-synced); brand values come from the tokens generated theme.
const require = createRequire(import.meta.url);
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

const tailwindThemeCss = readFileSync(
  require.resolve("tailwindcss/theme.css"),
  "utf8",
);
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

const staticThemeBlock = [`@theme static {`, ...neutralVars, ...brandVars, `}`].join("\n");
const source = createResponsiveUtilitySource(
  BREAKPOINT_ORDER,
  responsiveUtilities,
  colorRecipeUtilityCandidates,
  staticThemeBlock,
);

if (process.argv.includes("--check")) {
  if (!isUtilitySourceCurrent(outputPath, source)) {
    console.error(
      "src/generated/layout-utilities.generated.css is stale. Run pnpm generate:layout-utilities.",
    );
    process.exitCode = 1;
  } else {
    console.log("Layout utility source is current.");
  }
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, source, "utf8");
  console.log("Generated src/generated/layout-utilities.generated.css");
}
