import {
  BRAND_PALETTE_FAMILIES,
  TAILWIND_PALETTE_FAMILIES,
} from "../src/palette";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Emits the vendored Tailwind color families as `@theme static` variables.
 *
 * Color recipes in downstream packages reference any palette family/shade
 * at runtime through `var(--color-<family>-<shade>)` — invisible to the
 * consumer's Tailwind build scanner, and Tailwind tree-shakes unused
 * `@theme` variables — so the cookable palette must be emitted regardless of
 * utility usage.
 *
 * The authored theme (src/theme.css and its parts) owns the brand ramps and
 * white/black, emitting them statically already; this generator covers every
 * standard Tailwind color family — including neutral, whose ramp the
 * semantic layer references — and fail-fast checks that the authored palette
 * declares everything color cooking requires.
 */


const __dirname = resolve(fileURLToPath(import.meta.url), "..");
const require = createRequire(import.meta.url);

function generatePaletteStaticTheme() {
  const tailwindThemeCss = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8");
  const authoredPaletteCss = readFileSync(
    resolve(__dirname, "../src/theme/palette.css"),
    "utf8",
  );

  const shaded = /^ {2}(--color-[a-z]+-\d+): ([^;]+);$/gm;


  const collect = (family: string) =>
    [...tailwindThemeCss.matchAll(shaded)]
      .filter((match) => match[1].startsWith(`--color-${family}-`))
      .map((match) => `  ${match[1]}: ${match[2]};`)
      .sort();

  const vars = TAILWIND_PALETTE_FAMILIES.flatMap((family) => {
    const familyVars = collect(family);
    if (familyVars.length === 0) {
      throw new Error(`Palette family "${family}" has no variables in the installed Tailwind theme.`);
    }
    return familyVars;
  });

  for (const declaration of [
    ...BRAND_PALETTE_FAMILIES.map((family) => `--color-${family}-`),
    "--color-white:",
    "--color-black:",
  ]) {
    if (!authoredPaletteCss.includes(declaration)) {
      throw new Error(`The authored palette (src/theme/palette.css) is missing "${declaration}", which color cooking or the semantic layer requires.`);
    }
  }

  const css = `/* Auto-generated — run \`pnpm generate\` in packages/tokens to regenerate. */

/* Vendored Tailwind families used by runtime color cooking, including
   neutral, which the semantic layer references. The authored theme
   statically emits the brand ramps and white/black; this block covers every
   standard Tailwind family. */
@theme static {
${vars.join("\n")}
}
`;
  const outPath = resolve(__dirname, "../src/generated/styles/palette-static.css");
  writeFileSync(outPath, css, "utf-8");
  console.log(`✓ Generated ${relative(process.cwd(), outPath)}`);
}

generatePaletteStaticTheme();
