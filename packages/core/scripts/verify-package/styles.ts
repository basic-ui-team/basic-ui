import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fixtureRoot, linkExtractedPackage } from "./context";
import { assert } from "./report";

/**
 * Builds the published styles.css chain through @tailwindcss/vite, resolving
 * the extracted tarball copy through the package manifest like a real
 * Tailwind-using consumer. Asserts the responsive vocabulary in both plain
 * (sm:p-4) and digit-escaped (2xl:p-4 -> .\32 xl\:p-4) selector forms — the
 * escaped form is easy to miss when grepping built CSS.
 *
 * Also asserts the self-registration contract: the shipped stylesheet's
 * `@source "./"` must make consumer builds scan this package's dist, so
 * classes the components author as literals (focus rings, animations,
 * elevation) generate without any consumer-side safelist.
 */
export async function phaseStylesheetSmoke() {
  console.log("\n== 5. Published stylesheet through Tailwind ==");
  const dir = join(fixtureRoot, "styles");
  linkExtractedPackage(dir);
  writeFileSync(join(dir, "index.css"), '@import "@basic-ui/core/styles.css";\n');
  writeFileSync(join(dir, "entry.js"), 'import "./index.css";\nexport default 1;\n');

  await build({
    root: dir,
    logLevel: "silent",
    plugins: [tailwindcss()],
    build: {
      lib: {
        entry: join(dir, "entry.js"),
        formats: ["es"],
        fileName: "consumer",
        cssFileName: "consumer",
      },
      outDir: join(dir, "out"),
      emptyOutDir: true,
    },
  });

  const css = readFileSync(join(dir, "out", "consumer.css"), "utf8");
  assert("tokens theme resolves through the published chain", css.includes("--color-bg-base"));
  assert(
    "static palette variables resolve through the published chain",
    css.includes("--color-teal-700"),
  );
  assert("responsive selector generated (sm:p-4)", css.includes(".sm\\:p-4"));
  assert("digit-escaped responsive selector generated (2xl:p-4)", css.includes(".\\32 xl\\:p-4"));
  assert(
    "component-authored focus ring generated (focus-visible:ring-2)",
    css.includes(".focus-visible\\:ring-2"),
  );
  assert("component-authored animation generated (animate-spin)", css.includes(".animate-spin"));
  assert("component-authored elevation generated (z-modal)", css.includes(".z-modal"));
}
