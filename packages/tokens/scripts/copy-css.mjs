import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcCss = `${__dirname}/../src/pkg/styles/theme.css`;
const destDir = `${__dirname}/../dist/pkg/styles`;
const destCss = `${destDir}/theme.css`;

mkdirSync(destDir, { recursive: true });
copyFileSync(srcCss, destCss);
console.log(`✓ Copied theme.css to dist/pkg/styles/`);
