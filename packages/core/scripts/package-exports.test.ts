import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import corePackage from "../package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coreDir = resolve(__dirname, "..");
const componentsDir = join(coreDir, "src/components");

const publicComponents = readdirSync(componentsDir).filter((entry) =>
  statSync(join(componentsDir, entry)).isDirectory(),
);

const entryComponents = publicComponents.filter((component) =>
  existsSync(join(componentsDir, component, "index.ts")),
);

describe("@basic-ui/core package exports", () => {
  it("advertises the root, stylesheet, metadata and wildcard entries", () => {
    expect(Object.keys(corePackage.exports)).toEqual([".", "./styles.css", "./package.json", "./*"]);
    expect(corePackage.exports["."]).toEqual({
      types: "./dist/index.d.ts",
      dev: "./src/index.ts",
      import: "./dist/index.js",
    });
    expect(corePackage.exports["./*"]).toEqual({
      types: "./dist/components/*/index.d.ts",
      dev: "./src/components/*/index.ts",
      import: "./dist/components/*/index.js",
    });
  });

  it("keeps the published surface consistent with the manifest fields", () => {
    expect(corePackage.types).toBe("./dist/index.d.ts");
    expect(corePackage.main).toBe("./dist/index.js");
    expect(corePackage.module).toBe("./dist/index.js");
    expect("typesVersions" in corePackage).toBe(false);
    expect(corePackage.sideEffects).toEqual(["**/*.css"]);
    expect(corePackage.files).toEqual(["dist"]);
  });

  it("uses the components/<Name>/index.ts entry convention", () => {
    expect(entryComponents).not.toContain("Select");
    expect(entryComponents.length).toBeGreaterThan(0);
  });

  it("ships an entry and declarations for every public component when built", () => {
    const distComponents = join(coreDir, "dist/components");
    if (!existsSync(distComponents)) {
      return; // Dist assertions are covered by scripts/verify-package.mjs after a build.
    }
    for (const component of entryComponents) {
      expect(existsSync(join(distComponents, component, "index.js")), `${component} index.js`).toBe(
        true,
      );
      expect(
        existsSync(join(distComponents, component, "index.d.ts")),
        `${component} index.d.ts`,
      ).toBe(true);
    }
  });
});
