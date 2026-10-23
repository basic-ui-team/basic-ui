import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = `${__dirname}/../src`;
const destDir = `${__dirname}/../dist`;

mkdirSync(join(destDir, "theme"), { recursive: true });

copyFileSync(`${srcDir}/theme.css`, join(destDir, "theme.css"));
console.log("✓ Copied theme.css to dist/");

for (const file of readdirSync(`${srcDir}/theme`)) {
  copyFileSync(join(srcDir, "theme", file), join(destDir, "theme", file));
}
console.log("✓ Copied theme/ parts to dist/theme/");

copyFileSync(`${srcDir}/generated/styles/palette-static.css`, join(destDir, "palette-static.css"));
console.log("✓ Copied palette-static.css to dist/");
