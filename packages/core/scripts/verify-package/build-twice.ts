import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { coreDir, publicComponents, run } from "./context";
import { assert } from "./report";

function expectedOutputFiles(): string[] {
  const files = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/styles.css",
    "dist/generated/layout-utilities.generated.css",
  ];
  for (const component of publicComponents) {
    files.push("dist/components/" + component + "/index.js");
    files.push("dist/components/" + component + "/index.d.ts");
  }
  return files;
}

function assertBuildOutput(label: string) {
  for (const file of expectedOutputFiles()) {
    assert(label + ": " + file, existsSync(join(coreDir, file)));
  }
}

/**
 * The build must produce every public entry and declaration from scratch, and
 * again on a rebuild over existing output. The second run guards against
 * incremental TS state deciding declarations are up to date after `dist` was
 * wiped by the Vite step - the failure mode that previously shipped a package
 * without declarations while every build exited 0.
 */
export function phaseBuildTwice() {
  console.log("\n== 1. Clean build, then rebuild ==");
  rmSync(join(coreDir, "dist"), { recursive: true, force: true });
  run("pnpm build", { stdio: ["ignore", "ignore", "inherit"] });
  assertBuildOutput("clean build");
  run("pnpm build", { stdio: ["ignore", "ignore", "inherit"] });
  assertBuildOutput("second build");
}
