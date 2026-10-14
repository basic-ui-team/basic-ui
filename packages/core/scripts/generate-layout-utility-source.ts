import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import { createLayoutUtilitySource } from "../src/lib/layout/layout-utility-source";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/layout-utilities.generated.css");
const source = createLayoutUtilitySource(BREAKPOINT_ORDER);

if (process.argv.includes("--check")) {
  if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== source) {
    console.error(
      "src/generated/layout-utilities.generated.css is stale. Run pnpm generate:layout-utilities.",
    );
    process.exitCode = 1;
  } else {
    console.log("Layout utility source is current.");
  }
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, source, "utf8");
  console.log("Generated src/generated/layout-utilities.generated.css");
}
