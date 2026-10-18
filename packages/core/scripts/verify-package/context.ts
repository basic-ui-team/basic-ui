import { execSync } from "node:child_process";
import type { ExecSyncOptions } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const coreDir = resolve(__dirname, "../..");
export const fixtureRoot = resolve(coreDir, "scripts/fixtures/package-verify");
export const consumerDir = join(fixtureRoot, "consumer");

const componentsDir = join(coreDir, "src/components");

// Same convention as vite.config.ts: every src/components/<Name>/index.ts is a public entry.
export const publicComponents = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(componentsDir, entry.name, "index.ts")))
  .map((entry) => entry.name);

export function run(command: string, options: ExecSyncOptions = {}) {
  return execSync(command, { cwd: coreDir, ...options });
}

/**
 * Links targetDir/node_modules/@basic-ui/core to the extracted tarball copy in
 * the consumer fixture, so fixture builds resolve the package through its
 * manifest like an installed dependency.
 */
export function linkExtractedPackage(targetDir: string) {
  mkdirSync(join(targetDir, "node_modules/@basic-ui"), { recursive: true });
  symlinkSync(
    join(consumerDir, "node_modules/@basic-ui/core"),
    join(targetDir, "node_modules/@basic-ui/core"),
    "junction",
  );
}

