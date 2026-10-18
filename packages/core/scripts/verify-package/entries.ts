import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "vite";
import { fixtureRoot, linkExtractedPackage, publicComponents } from "./context";
import { assert } from "./report";

/**
 * Bundles a fixture that imports every public entry through the package
 * manifest (resolved from the extracted tarball copy), then imports the bundle
 * and asserts each entry exports its implementation, including Card compound
 * members. Bundling is required because the raw dist cannot be imported by
 * Node directly.
 */
export async function phaseRuntimeEntries() {
  console.log("\n== 3. Runtime imports through the manifest ==");
  const entries: Record<string, string> = { root: "@basic-ui/core" };
  const expectations: Record<string, string[]> = {};
  const rootExpected: string[] = [];
  for (const component of publicComponents) {
    entries[component] = "@basic-ui/core/" + component;
    const expected = [component];
    if (component === "Pagination") {
      expected.length = 0;
      expected.push("TablePagination", "LinkPagination");
      rootExpected.push("TablePagination", "LinkPagination");
    } else {
      rootExpected.push(component);
    }
    if (component === "Card") {
      expected.push(
        "Card.Header",
        "Card.Body",
        "Card.Footer",
        "Card.Title",
        "Card.Description",
        "Card.Image",
        "Card.Unstyled",
      );
    }
    expectations[component] = expected;
  }
  expectations.root = rootExpected;

  const entriesDir = join(fixtureRoot, "entries");
  linkExtractedPackage(entriesDir);
  const entryNames = Object.keys(entries);
  const fixtureLines = entryNames.map(
    (name) => "import * as " + name + ' from "' + entries[name] + '";',
  );
  fixtureLines.push("export { " + entryNames.join(", ") + " };");
  writeFileSync(join(entriesDir, "all-entries.jsx"), fixtureLines.join("\n") + "\n");
  await build({
    root: entriesDir,
    logLevel: "silent",
    build: {
      lib: {
        entry: join(entriesDir, "all-entries.jsx"),
        formats: ["es"],
        fileName: "all-entries",
      },
      minify: false,
      outDir: join(entriesDir, "out"),
      emptyOutDir: true,
      rolldownOptions: { external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/] },
    },
  });

  writeFileSync(join(entriesDir, "expectations.json"), JSON.stringify(expectations));
  const checkerLines = [
    'import { readFileSync } from "node:fs";',
    'const expectations = JSON.parse(',
    '  readFileSync(new URL("./expectations.json", import.meta.url), "utf8"),',
    ");",
    'const bundle = await import(new URL("./out/all-entries.js", import.meta.url).href);',
    "const problems = [];",
    "for (const [entry, expected] of Object.entries(expectations)) {",
    "  const namespace = bundle[entry];",
    "  if (namespace == null) {",
    '    problems.push("missing entry namespace " + entry);',
    "    continue;",
    "  }",
    "  for (const member of expected) {",
    "    const value = member",
    '      .split(".")',
    "      .reduce((acc, key) => (acc == null ? acc : acc[key]), namespace);",
    "    if (value == null) {",
    '      problems.push(entry + " missing " + member);',
    "    }",
    "  }",
    "}",
    "console.log(JSON.stringify(problems));",
  ];
  writeFileSync(join(entriesDir, "entry-check.mjs"), checkerLines.join("\n") + "\n");
  const result = spawnSync(process.execPath, [join(entriesDir, "entry-check.mjs")], {
    cwd: entriesDir,
    encoding: "utf8",
  });
  const problems =
    result.status === 0
      ? JSON.parse((result.stdout ?? "").trim())
      : ["entry check crashed: " + (result.stderr ?? "")];
  assert(
    "every public entry exports its implementation and compound members",
    problems.length === 0,
    problems.length > 0 ? problems.join("; ") : entryNames.length + " entries imported",
  );
}
