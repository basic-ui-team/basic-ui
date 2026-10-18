import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { consumerDir, coreDir, fixtureRoot, run } from "./context";
import { assert } from "./report";

/**
 * Packs the package and inspects the extracted tarball: it must ship only dist
 * output, no test/story declarations, no private source aliases in
 * declarations, and React must stay external instead of being inlined.
 *
 * The extracted copy stays in consumerDir/node_modules/@basic-ui/core for the
 * later fixture phases.
 */
export function phasePackAndExtract() {
  console.log("\n== 2. Pack the package ==");
  const packDir = join(fixtureRoot, "pack");
  mkdirSync(packDir, { recursive: true });
  run('pnpm pack --pack-destination "' + packDir + '"', { stdio: ["ignore", "ignore", "inherit"] });
  const tarball = readdirSync(packDir).find((file) => file.endsWith(".tgz"));
  assert("pnpm pack produced a tarball", Boolean(tarball), String(tarball));

  const packageDir = join(consumerDir, "node_modules/@basic-ui/core");
  mkdirSync(join(consumerDir, "node_modules/@basic-ui"), { recursive: true });
  rmSync(packageDir, { recursive: true, force: true });
  mkdirSync(packageDir, { recursive: true });
  if (tarball === undefined) {
    return;
  }

  const tarBinary =
    process.platform === "win32" && existsSync("C:/Windows/System32/tar.exe")
      ? "C:/Windows/System32/tar.exe"
      : "tar";
  const extracted = spawnSync(
    tarBinary,
    ["-xzf", join(packDir, tarball), "-C", packageDir, "--strip-components=1"],
    { cwd: coreDir, encoding: "utf8" },
  );
  if (extracted.status !== 0) {
    throw new Error("tar extraction failed: " + (extracted.stderr ?? ""));
  }

  assert("extracted package has dist output", existsSync(join(packageDir, "dist/index.js")));
  assert("extracted package does not ship src", !existsSync(join(packageDir, "src")));
  assert(
    "extracted package does not ship test declarations",
    !existsSync(join(packageDir, "dist/components/Button/Button.test.d.ts")),
  );
  assert(
    "declarations do not reference private source aliases",
    !readFileSync(join(packageDir, "dist/components/Card/index.d.ts"), "utf8").includes("@core/"),
  );

  // Core output must externalize React including runtime subpaths instead of
  // bundling the JSX runtime.
  const distDirectory = join(packageDir, "dist");
  const distChunks = readdirSync(distDirectory).filter((file) => file.endsWith(".js"));
  let externalRuntime = false;
  let inlinedRuntime = false;
  for (const chunk of distChunks) {
    const text = readFileSync(join(distDirectory, chunk), "utf8");
    if (text.includes("react/jsx-runtime")) externalRuntime = true;
    if (text.includes("Static children should always be an array")) inlinedRuntime = true;
  }
  assert(
    "Core dist imports react/jsx-runtime instead of inlining it",
    externalRuntime && !inlinedRuntime,
  );
  rmSync(packDir, { recursive: true, force: true });
}
