import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = `${__dirname}/../src/generated/styles`;
const destDir = `${__dirname}/../dist/generated/styles`;

mkdirSync(destDir, { recursive: true });

const files = ["theme.css", "palette-static.css"];

for (const file of files) {
  copyFileSync(join(srcDir, file), join(destDir, file));
  console.log(`✓ Copied ${file} to dist/generated/styles/`);
}
