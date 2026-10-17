import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import {
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  responsiveUtilities,
} from "./responsive-utilities";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/layout-utilities.generated.css");
const source = createResponsiveUtilitySource(BREAKPOINT_ORDER, responsiveUtilities);

if (process.argv.includes("--check")) {
  if (!isUtilitySourceCurrent(outputPath, source)) {
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
