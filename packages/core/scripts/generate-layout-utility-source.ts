import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import {
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  responsiveUtilities,
} from "../src/lib/responsive-utilities";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/layout-utilities.generated.css");

/**
 * Semantic token classes authored as literals in the component variant
 * tables. Real consumer builds discover them by scanning the package dist
 * (`@source "./"`); this list additionally guarantees them for zero-scan
 * builds and the responsive CSS fixture, which stages only the stylesheets.
 * Keep in sync with the variant tables.
 */
const semanticUtilityCandidates = [
  "bg-primary", "hover:bg-primary-hover", "active:bg-primary-active",
  "bg-destructive", "hover:bg-destructive-hover", "active:bg-destructive-active",
  "bg-background", "bg-foreground", "text-background",
  "bg-muted", "hover:bg-muted-hover", "active:bg-muted-active",
  "bg-surface", "bg-surface/5", "bg-overlay", "text-overlay-foreground",
  "text-foreground", "text-muted-foreground", "hover:text-foreground",
  "text-primary", "text-primary-foreground",
  "text-destructive", "text-destructive-foreground",
  "bg-success", "text-success", "bg-success/10", "text-success-foreground",
  "bg-warning", "text-warning", "bg-warning/10", "text-warning-foreground",
  "bg-info", "text-info", "bg-info/10", "text-info-foreground",
  "bg-destructive/10",
  "border-border", "border-muted", "border-input", "border-t-transparent",
  "border-success", "border-l-success",
  "border-warning", "border-l-warning",
  "border-destructive", "border-l-destructive",
  "border-info", "border-l-info",
  "ring-ring", "focus-visible:ring-ring", "ring-offset-background",
  "[&_[data-slot=thumb]]:bg-background",
  "[&_[data-slot=thumb]]:bg-primary-foreground",
];

const source = createResponsiveUtilitySource(
  BREAKPOINT_ORDER,
  responsiveUtilities,
  semanticUtilityCandidates,
);

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
