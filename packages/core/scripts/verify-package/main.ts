/**
 * Packaging regression checks for @basic-ui/core.
 *
 * Run when package.json, the build config, or component entry files change:
 *
 *   pnpm --filter @basic-ui/core verify:package
 *
 * Phases, in order (each in its own module):
 *   1. build-twice  - clean build, then rebuild; every entry and declaration
 *      must exist on both runs.
 *   2. pack         - pack and inspect the extracted tarball, leaving it as
 *      the installed package for the fixture phases.
 *   3. entries      - every public entry imports through the manifest and
 *      exports its implementation, including Card compound members.
 *   4. ts-fixture   - external-style TS fixture compiles with root and
 *      component prop-type imports.
 *   5. styles       - the published styles.css chain generates the responsive
 *      vocabulary through @tailwindcss/vite.
 */
import { rmSync } from "node:fs";
import { fixtureRoot, publicComponents } from "./context";
import { failureCount } from "./report";
import { phaseBuildTwice } from "./build-twice";
import { phasePackAndExtract } from "./pack";
import { phaseRuntimeEntries } from "./entries";
import { phaseTypeScriptFixture } from "./ts-fixture";
import { phaseStylesheetSmoke } from "./styles";

async function main() {
  console.log(
    "Verifying @basic-ui/core package exports (" + publicComponents.length + " public components)",
  );
  rmSync(fixtureRoot, { recursive: true, force: true });
  phaseBuildTwice();
  phasePackAndExtract();
  await phaseRuntimeEntries();
  phaseTypeScriptFixture();
  await phaseStylesheetSmoke();

  if (failureCount() > 0) {
    console.log(
      "\n" +
        failureCount() +
        " check(s) failed. Fixture kept at " +
        fixtureRoot +
        " for inspection.",
    );
    process.exitCode = 1;
    return;
  }
  rmSync(fixtureRoot, { recursive: true, force: true });
  console.log("\nAll package-export checks passed. Temporary fixtures removed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
