#!/usr/bin/env node
/**
 * Enforces the component composition rule (#60):
 * components in packages/core/src/components/** may not import another public
 * component except Box (the primitive layer).
 *
 * KNOWN_VIOLATIONS exists for temporarily grandfathering violations that are
 * scheduled for removal; it is currently empty.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "packages/core/src/components");
const PRIMITIVE = "Box";

const PUBLIC_COMPONENTS = new Set(
  readdirSync(componentsDir).filter((entry) =>
    statSync(join(componentsDir, entry)).isDirectory(),
  ),
);

const KNOWN_VIOLATIONS = new Set([]);

const importPattern = /(?:^|\n)\s*(?:import\s+(?:type\s+)?[^;]*?from\s+|export\s+(?:type\s+)?\{[^}]*\}\s+from\s+)["']([^"']+)["']/g;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.|\.stories\./.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function resolveTargetComponent(importerDir, specifier) {
  let target = null;
  const coreComponentsMatch = specifier.match(/@core\/components(?:\/(.+))?/);
  if (coreComponentsMatch) {
    target = coreComponentsMatch[1] ? basename(coreComponentsMatch[1]) : null;
  } else if (specifier.startsWith(".")) {
    const resolved = resolve(importerDir, specifier);
    const relative = resolved.slice(componentsDir.length + 1);
    target = relative.split("/")[0] || null;
  }
  if (target === "index") return null;
  return target;
}

const violations = [];
const warnings = [];

for (const file of walk(componentsDir)) {
  const relativeFile = file.slice(componentsDir.length + 1);
  // The components barrel and intra-anatomy imports (within the same top-level
  // component folder) are exempt.
  if (relativeFile === "index.ts") continue;
  const owner = relativeFile.split("/")[0];
  const source = readFileSync(file, "utf8");
  let match;
  while ((match = importPattern.exec(source)) !== null) {
    const specifier = match[1];
    const target = resolveTargetComponent(dirname(file), specifier);
    if (!target || !PUBLIC_COMPONENTS.has(target) || target === PRIMITIVE) continue;
    if (target === owner) continue;
    const relative = file.slice(root.length + 1);
    const key = `${relative} -> ${target}`;
    if (KNOWN_VIOLATIONS.has(key)) {
      warnings.push(key);
    } else {
      violations.push(key);
    }
  }
}

if (warnings.length > 0) {
  console.warn(
    `Known composition violations (scheduled in #85, #86, #87):\n  ${warnings.join("\n  ")}`,
  );
}

if (violations.length > 0) {
  console.error(
    `Component composition rule violations (only Box may be imported by other components):\n  ${violations.join("\n  ")}`,
  );
  process.exit(1);
}

console.log("Component composition check passed.");
