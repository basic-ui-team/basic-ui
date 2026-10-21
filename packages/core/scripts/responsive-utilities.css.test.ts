import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { compile } from "tailwindcss";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import corePackage from "../package.json";
import tokensPackage from "../../tokens/package.json";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import {
  createResponsiveUtilitySource,
  responsiveUtilities,
} from "../src/lib/responsive-utilities";
import { toggleSizeClasses, toggleThumbGeometryVariants } from "../src/components/Toggle/toggle.variants";
import { badgeGeometryVariants } from "../src/components/Badge/badge.variants";
import { gridVariants } from "../src/components/Grid/grid.variants";
import { dividerThicknessClasses } from "../src/components/Divider/divider.variants";
import { spacingSteps } from "../src/lib/layout.types";
import { generateLayoutClassNames } from "../src/lib/layout-utils";
import { iconSizeClasses } from "../src/components/Icon/icon.variants";
import { spinnerSizeClasses } from "../src/components/Spinner/spinner.variants";
import { buttonSizeClasses } from "../src/components/Button/button.variants";
import { headerSizeClasses, headerAlignClasses } from "../src/components/Header/header.variants";
import { textSizeClasses, textAlignClasses } from "../src/components/Text/text.variants";
import { imageObjectFitClasses, imageAspectRatioClasses } from "../src/components/Image/image.variants";
import {
  cardSectionSpacingClasses,
  cardTitleSizeClasses,
  cardDescriptionSizeClasses,
  cardTextAlignClasses,
  cardImageObjectFitClasses,
  cardImageAspectRatioClasses,
} from "../src/components/Card/card.variants";
import { flexVariants } from "../src/components/Flex/flex.variants";
import { resolveLayoutClass } from "../src/lib/layout-utils";
import { SizingValues } from "../src/lib/layout.types";
import { getTextFlowClasses, textWrapClasses } from "../src/lib/text-flow";

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = readFileSync(
  resolve(coreRoot, "scripts/fixtures/responsive-utilities.css"),
  "utf8",
);
let directory: string;
let generatedPath: string;

function stageStyles(
  manifest: { name: string },
  packageRoot: string,
  files: Readonly<Record<string, string>>,
) {
  const destination = join(directory, "node_modules", manifest.name);
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, "package.json"), JSON.stringify(manifest));

  for (const [source, target] of Object.entries(files)) {
    const output = resolve(destination, target);
    mkdirSync(dirname(output), { recursive: true });
    copyFileSync(resolve(packageRoot, source), output);
  }
}

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "basic-ui-responsive-css-"));

  // Stage the exported CSS layout so tests do not depend on a previous package build.
  stageStyles(corePackage, coreRoot, {
    "src/styles.css": corePackage.exports["./styles.css"],
    "src/generated/layout-utilities.generated.css":
      "./dist/generated/layout-utilities.generated.css",
  });
  stageStyles(tokensPackage, resolve(coreRoot, "../tokens"), {
    "src/generated/styles/theme.css": tokensPackage.exports["./styles/theme.css"],
    "src/generated/styles/palette-static.css":
      tokensPackage.exports["./styles/palette-static.css"],
  });
  generatedPath = join(
    directory,
    "node_modules",
    corePackage.name,
    "dist",
    "generated",
    "layout-utilities.generated.css",
  );
});

afterAll(() => {
  if (directory) {
    rmSync(directory, { recursive: true });
  }
});

async function compileFixture(generatedSource?: string, theme = "") {
  const require = createRequire(join(directory, "package.json"));
  const compiler = await compile(`${fixture}\n${theme}`, {
    base: directory,
    loadStylesheet: async (id, base) => {
      const path = require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id, {
        paths: [base, coreRoot],
      });
      return {
        path,
        base: dirname(path),
        content:
          path === generatedPath && generatedSource !== undefined
            ? generatedSource
            : readFileSync(path, "utf8"),
      };
    },
  });

  expect(compiler.root).toBe("none");
  // Automatic detection is off; the only registered source is the package's
  // self-registration (`@source "./"` in the shipped stylesheet), which scans
  // the staged dist for component-authored literals.
  expect(compiler.sources).toEqual([
    {
      base: join(directory, "node_modules", "@basic-ui", "core", "dist"),
      pattern: "./",
      negated: false,
    },
  ]);
  return compiler.build([]);
}

function expectUtilityCoverage(css: string, classes: readonly string[]) {
  for (const utility of new Set(classes.join(" ").split(/\s+/).filter(Boolean))) {
    for (const breakpoint of BREAKPOINT_ORDER) {
      const candidate = breakpoint === "base" ? utility : `${breakpoint}:${utility}`;
      const escaped = candidate.replace(/[^a-zA-Z0-9_-]/g, "\\$&").replace(/^2/, "\\32 ");
      expect(css, `Missing CSS for ${candidate}`).toContain(`.${escaped} {`);
    }
  }
}

const geometryMaps = {
  Icon: iconSizeClasses,
  Spinner: spinnerSizeClasses,
  Button: buttonSizeClasses,
  HeaderSize: headerSizeClasses,
  HeaderAlign: headerAlignClasses,
  TextSize: textSizeClasses,
  TextAlign: textAlignClasses,
  ImageFit: imageObjectFitClasses,
  ImageRatio: imageAspectRatioClasses,
  CardSection: cardSectionSpacingClasses,
  CardTitle: cardTitleSizeClasses,
  CardDescription: cardDescriptionSizeClasses,
  CardAlign: cardTextAlignClasses,
  CardImageFit: cardImageObjectFitClasses,
  CardImageRatio: cardImageAspectRatioClasses,
  TextWrap: textWrapClasses,
};

describe("responsive utilities through the public CSS entry", () => {
  it.each(Object.entries(geometryMaps))("covers the actual %s geometry map", async (_name, classes) => {
    expectUtilityCoverage(await compileFixture(), Object.values(classes));
  });

  it("uses consumer CSS breakpoints rather than runtime breakpoint constants", async () => {
    const css = await compileFixture(undefined, "@theme { --breakpoint-md: 900px; }");
    expect(css).toContain("@media (width >= 900px)");
    expect(css).not.toContain("@media (width >= 768px)");
    expectUtilityCoverage(css, Object.values(iconSizeClasses));
  });

  it("covers every layout axis and Flex composition without scalar recipes", async () => {
    const classes = [
      ...spacingSteps.flatMap((step) =>
        (["p", "px", "py", "pt", "pr", "pb", "pl", "m", "mx", "my", "mt", "mr", "mb", "ml", "gap", "gapX", "gapY"] as const)
          .map((prop) => resolveLayoutClass(prop, step))),
      ...SizingValues.flatMap((value) =>
        (["h", "hMin", "w", "wMin"] as const).map((prop) => resolveLayoutClass(prop, value))),
      ...(["none", "full", "screen", "min", "max", "fit"] as const)
        .map((value) => `${resolveLayoutClass("hMax", value)} ${resolveLayoutClass("wMax", value)}`),
      ...(["visible", "hidden", "auto", "scroll"] as const)
        .map((value) => `${resolveLayoutClass("overflow", value)} ${resolveLayoutClass("overflowX", value)} ${resolveLayoutClass("overflowY", value)}`),
      ...(["static", "relative", "absolute", "fixed", "sticky"] as const)
        .map((position) => resolveLayoutClass("position", position)),
      ...(["block", "inline", "inline-block", "none"] as const)
        .map((display) => resolveLayoutClass("display", display)),
      ...(["row", "column", "row-reverse", "column-reverse"] as const)
        .map((direction) => flexVariants({ direction })),
      ...(["nowrap", "wrap", "reverse"] as const).map((wrap) => flexVariants({ wrap })),
      ...(["start", "end", "center", "stretch"] as const)
        .map((value) => flexVariants({ justify: value, align: value })),
      ...(["between", "around", "evenly"] as const).map((justify) => flexVariants({ justify })),
      flexVariants({ display: "flex" }), flexVariants({ display: "inline-flex" }),
    ];
    expectUtilityCoverage(await compileFixture(), classes);
  });

  it("covers actual text-flow truncation and restoration output", async () => {
    const { className } = getTextFlowClasses({
      truncate: { base: true, md: false, lg: true, xl: false },
      wrap: { base: "pretty", xl: "nowrap" },
      overflowX: { base: "auto", md: "scroll" },
      overflowY: { base: "hidden", xl: "visible" },
    });
    const css = await compileFixture();
    for (const candidate of className.split(/\s+/)) {
      const escaped = candidate.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
      expect(css, `Missing CSS for ${candidate}`).toContain(`.${escaped} {`);
    }
  });

  it("compiles concrete layout resets including maximum dimensions", async () => {
    const css = await compileFixture();
    const { layoutClassNameString } = generateLayoutClassNames({
      p: { base: 4, md: 0 },
      h: { base: "full", md: "auto" },
      hMax: { base: "screen", md: "none" },
      wMax: { base: "none", md: "full", lg: "none" },
      overflow: { base: "hidden", md: "visible" },
    });
    for (const candidate of layoutClassNameString.split(/\s+/)) {
      const escaped = candidate.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
      expect(css, `Missing CSS for ${candidate}`).toContain(`.${escaped} {`);
    }
    expect(css).toContain("max-height: none");
    expect(css).toContain("max-width: none");
    expect(css).not.toContain("max-h-auto");
    expect(css).not.toContain("max-w-auto");
  });

  it("covers Grid presets, axis gaps, and directional Divider thickness", async () => {
    const css = await compileFixture();
    const classes = [
      ...(["none", "sidebar", "hero", "masonry", "card-list", "symmetric", "asymmetric"] as const)
        .map((templatePreset) => gridVariants({ templatePreset })),
      ...spacingSteps.flatMap((step) => [
        resolveLayoutClass("gap", step),
        resolveLayoutClass("gapY", step),
        resolveLayoutClass("gapX", step),
      ]),
      ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const)
        .map((count) => gridVariants({ cols: count, rows: count })),
      ...(["row", "column", "dense"] as const).map((autoFlow) => gridVariants({ autoFlow })),
      ...(["min", "max", "fr", true] as const)
        .map((value) => gridVariants({ autoRows: value, autoCols: value })),
      ...(["start", "end", "center", "stretch"] as const)
        .map((value) => gridVariants({
          alignItems: value, justifyItems: value, alignContent: value, justifyContent: value,
        })),
      ...(["between", "around", "evenly"] as const)
        .map((value) => gridVariants({ alignContent: value, justifyContent: value })),
      ...Object.values(dividerThicknessClasses).flatMap((values) => Object.values(values)),
    ];
    expectUtilityCoverage(css, classes);
  });

  it("covers count and dot Badge geometry at every breakpoint", async () => {
    const css = await compileFixture();
    for (const variant of ["count", "dot"] as const) {
      for (const size of ["sm", "md", "lg"] as const) {
        expectUtilityCoverage(css, [badgeGeometryVariants({ variant, size })]);
      }
    }
  });

  it("covers actual Toggle track and thumb recipes in both states", async () => {
    const css = await compileFixture();
    for (const size of ["sm", "md", "lg"] as const) {
      for (const checked of [false, true]) {
        expectUtilityCoverage(css, [toggleSizeClasses[size], toggleThumbGeometryVariants({ size, checked })]);
      }
    }
  });

  it("compiles every approved utility at every breakpoint without scanning source", async () => {
    const css = await compileFixture();

    for (const breakpoint of BREAKPOINT_ORDER) {
      const prefix =
        breakpoint === "base" ? "" : breakpoint === "2xl" ? "\\32 xl\\:" : `${breakpoint}\\:`;
      for (const utility of responsiveUtilities) {
        const selector = `.${prefix}${utility.replace(/[^a-zA-Z0-9_-]/g, "\\$&")}`;
        expect(css.includes(`${selector} {`), `Missing CSS for ${breakpoint}:${utility}`).toBe(
          true,
        );
      }
    }
    expect(css).toContain("@media (width >= 768px)");
    expect(css).toContain("border-width: 9px");
    expect(css).toContain("grid-template-columns: repeat(12, minmax(0, 1fr))");
    for (const excluded of ["bg-red-500", "font-bold", "shadow-s1", "animate-spin"]) {
      expect(css).not.toContain(`.md\\:${excluded} {`);
    }

    console.info(
      `Responsive CSS fixture: ${responsiveUtilities.length} utilities, ${
        responsiveUtilities.length * BREAKPOINT_ORDER.length
      } candidates, ${Buffer.byteLength(css)} raw bytes, ${gzipSync(css).length} gzip bytes`,
    );
  });

  it("preserves explicitly supplied modifiers, quoted selectors, and arbitrary values", async () => {
    const utilities = [
      "h-4",
      "dark:h-5",
      "content-['saved']",
      'data-[state="checked"]:w-5',
      "grid-cols-[repeat(2,minmax(0,1fr))]",
      "[&_[data-slot=thumb]]:translate-x-4",
      "data-[checked=true]:w-4",
    ];
    const css = await compileFixture(createResponsiveUtilitySource(["base", "md"], utilities));

    for (const utility of utilities) {
      const selector = `.${`md:${utility}`.replace(/[^a-zA-Z0-9_-]/g, "\\$&")}`;
      expect(css).toContain(selector);
    }
    expect(css).toContain("@media (width >= 768px)");
    expect(css).not.toContain(".md\\:flex-row");
  });
});

describe("color recipe utilities in the public CSS entry", () => {
  it("generates recipe channel utilities from the safelist", async () => {
    const css = await compileFixture();
    // Recipe candidates are fixed utilities: no responsive prefixes apply.
    const escape = (utility: string) => utility.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
    for (const utility of [
      "bg-(--cr-bg)",
      "hover:bg-(--cr-bg-hover)",
      "active:bg-(--cr-bg-active)",
      "text-(color:--cr-text)",
      "border-(--cr-border)",
      "dark:bg-(--cr-bg-dark)",
      "dark:hover:bg-(--cr-bg-hover-dark)",
    ]) {
      expect(css, `Missing CSS for ${utility}`).toContain(`.${escape(utility)} {`);
    }
    expect(css).toContain("background-color: var(--cr-bg)");
    expect(css).toContain("color: var(--cr-text)");
  });

  it("emits palette theme variables statically for recipes", async () => {
    const css = await compileFixture();
    // Previously tree-shaken families must be present regardless of usage.
    for (const variable of [
      "--color-rose-700:",
      "--color-violet-700:",
      "--color-emerald-700:",
      "--color-primary-700:",
      "--color-white:",
    ]) {
      expect(css).toContain(variable);
    }
  });

  it("stays bounded by the recipe channels, not the color palette", async () => {
    const css = await compileFixture();
    expect(css).not.toContain(".bg-teal-700");
    expect(css).not.toContain(".bg-violet-700");
    expect(css).not.toContain(".text-rose-600");
  });
});
