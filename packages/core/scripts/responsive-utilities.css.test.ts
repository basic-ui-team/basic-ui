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
import { createResponsiveUtilitySource, responsiveUtilities } from "./responsive-utilities";

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
    "src/generated/layout-utilities.generated.css": "./dist/generated/layout-utilities.generated.css",
  });
  stageStyles(tokensPackage, resolve(coreRoot, "../tokens"), {
    "src/generated/styles/theme.css": tokensPackage.exports["./styles/theme.css"],
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

async function compileFixture(generatedSource?: string) {
  const require = createRequire(join(directory, "package.json"));
  const compiler = await compile(fixture, {
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
  expect(compiler.sources).toEqual([]);
  return compiler.build([]);
}

describe("responsive utilities through the public CSS entry", () => {
  it("compiles every approved utility at every breakpoint without scanning source", async () => {
    const css = await compileFixture();

    for (const breakpoint of BREAKPOINT_ORDER) {
      const prefix =
        breakpoint === "base" ? "" : breakpoint === "2xl" ? "\\32 xl\\:" : `${breakpoint}\\:`;
      for (const utility of responsiveUtilities) {
        const selector = `.${prefix}${utility.replace(/[^a-zA-Z0-9_-]/g, "\\$&")}`;
        expect(css.includes(`${selector} {`), `Missing CSS for ${breakpoint}:${utility}`).toBe(true);
      }
    }
    expect(css).toContain("@media (width >= 768px)");
    expect(css).toContain("border-width: 9px");
    expect(css).toContain("grid-template-columns: repeat(12, minmax(0, 1fr))");
    for (const excluded of ["bg-red-500", "font-bold", "shadow-s1", "animate-spin"]) {
      expect(css).not.toContain(`.md\\:${excluded} {`);
    }

    console.info(
      `Responsive CSS fixture: ${responsiveUtilities.length} utilities, ${responsiveUtilities.length * BREAKPOINT_ORDER.length} candidates, ${Buffer.byteLength(css)} raw bytes, ${gzipSync(css).length} gzip bytes`,
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
