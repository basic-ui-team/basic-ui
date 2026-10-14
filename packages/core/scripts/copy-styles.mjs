import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(__dirname, "../src");
const destinationDirectory = resolve(__dirname, "../dist");

const files = [
  ["styles.css", "styles.css"],
  ["generated/layout-utilities.generated.css", "generated/layout-utilities.generated.css"],
];

for (const [source, destination] of files) {
  const destinationPath = resolve(destinationDirectory, destination);
  mkdirSync(dirname(destinationPath), { recursive: true });
  copyFileSync(resolve(sourceDirectory, source), destinationPath);
}

console.log("Copied Core stylesheet sources to dist/");
