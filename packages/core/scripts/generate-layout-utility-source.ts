import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import { flexVariantsConfig } from "../src/components/Flex/flex.variants";
import { layoutVariantsConfig } from "../src/lib/layout/layout.variants";
import {
  collectResponsiveUtilities,
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  type ResponsiveUtilitySource,
} from "./responsive-utilities";

const responsiveSources = [
  layoutVariantsConfig,
  flexVariantsConfig,
] satisfies readonly ResponsiveUtilitySource[];

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/layout-utilities.generated.css");
const utilities = collectResponsiveUtilities(responsiveSources);
const source = createResponsiveUtilitySource(BREAKPOINT_ORDER, utilities);

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
