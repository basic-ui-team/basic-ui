import { existsSync, readFileSync } from "node:fs";
import { flexVariants } from "../components/Flex/flex.variants";
import { gridVariants } from "../components/Grid/grid.variants";
import { buttonSizeClasses } from "../components/Button/button.variants";
import { iconSizeClasses } from "../components/Icon/icon.variants";
import { spinnerSizeClasses } from "../components/Spinner/spinner.variants";
import { textSizeClasses, textAlignClasses } from "../components/Text/text.variants";
import { headerSizeClasses, headerAlignClasses } from "../components/Header/header.variants";
import { imageObjectFitClasses, imageAspectRatioClasses } from "../components/Image/image.variants";
import {
  cardSectionSpacingClasses,
  cardTitleSizeClasses,
  cardDescriptionSizeClasses,
  cardTextAlignClasses,
  cardImageObjectFitClasses,
  cardImageAspectRatioClasses,
} from "../components/Card/card.variants";
import {
  toggleSizeClasses,
  toggleThumbGeometryVariants,
} from "../components/Toggle/toggle.variants";
import { dividerThicknessClasses } from "../components/Divider/divider.variants";
import { textWrapClasses } from "./text-flow";

/**
 * The responsive vocabulary: every utility class the library constructs at
 * runtime (responsive prop values and geometry maps), so the generated
 * safelist guarantees CSS at every breakpoint. Derived from the same cva
 * tables and maps the components use — the single source of truth.
 *
 * Classes the components author as literals (cva base strings, one-off
 * utilities) are not listed here: consumer builds discover them through the
 * shipped stylesheet's `@source "./"` self-registration.
 */

const flexDirections = ["row", "column", "row-reverse", "column-reverse"] as const;
const flexWraps = ["nowrap", "wrap", "reverse"] as const;
const flexDisplays = ["flex", "inline-flex"] as const;
const flexJustify = ["start", "end", "center", "between", "around", "evenly", "stretch"] as const;
const flexAlign = ["start", "end", "center", "stretch"] as const;

const gridCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const gridFlows = ["row", "column", "dense"] as const;
const gridAutoSizes = ["min", "max", "fr", true] as const;
const gridAlign = ["start", "end", "center", "stretch"] as const;
const gridContent = ["start", "end", "center", "stretch", "between", "around", "evenly"] as const;
const gridPresets = [
  "none",
  "sidebar",
  "hero",
  "masonry",
  "card-list",
  "symmetric",
  "asymmetric",
] as const;

const overflowValues = ["visible", "hidden", "auto", "scroll"] as const;

function classesOf(...values: (string | undefined)[]): string[] {
  return values.flatMap((value) => (value ?? "").split(/\s+/)).filter(Boolean);
}

function geometryMapClasses(map: Record<string, unknown>): string[] {
  return Object.values(map).flatMap((value) =>
    typeof value === "string" ? value.split(/\s+/) : [],
  );
}

export const responsiveUtilityFamilies = {
  flex: classesOf(
    ...flexDirections.map((direction) => flexVariants({ direction })),
    ...flexWraps.map((wrap) => flexVariants({ wrap })),
    ...flexDisplays.map((display) => flexVariants({ display })),
  ),
  alignment: classesOf(
    ...flexJustify.map((justify) => flexVariants({ justify })),
    ...flexAlign.map((align) => flexVariants({ align })),
  ),
  display: classesOf("flex", "inline-flex", "grid", "inline-grid", "hidden"),
  grid: classesOf(
    ...gridCounts.map((cols) => gridVariants({ cols })),
    ...gridCounts.map((rows) => gridVariants({ rows })),
    ...gridFlows.map((autoFlow) => gridVariants({ autoFlow })),
    ...gridAutoSizes.map((autoRows) => gridVariants({ autoRows })),
    ...gridAutoSizes.map((autoCols) => gridVariants({ autoCols })),
    ...gridAlign.map((alignItems) => gridVariants({ alignItems })),
    ...gridAlign.map((justifyItems) => gridVariants({ justifyItems })),
    ...gridContent.map((alignContent) => gridVariants({ alignContent })),
    ...gridContent.map((justifyContent) => gridVariants({ justifyContent })),
  ),
  gridTemplates: classesOf(...gridPresets.map((templatePreset) => gridVariants({ templatePreset }))),
  componentGeometry: classesOf(
    ...geometryMapClasses(buttonSizeClasses),
    ...geometryMapClasses(iconSizeClasses),
    ...geometryMapClasses(spinnerSizeClasses),
    ...geometryMapClasses(textSizeClasses),
    ...geometryMapClasses(textAlignClasses),
    ...geometryMapClasses(headerSizeClasses),
    ...geometryMapClasses(headerAlignClasses),
    ...geometryMapClasses(imageObjectFitClasses),
    ...geometryMapClasses(imageAspectRatioClasses),
    ...geometryMapClasses(cardSectionSpacingClasses),
    ...geometryMapClasses(cardTitleSizeClasses),
    ...geometryMapClasses(cardDescriptionSizeClasses),
    ...geometryMapClasses(cardTextAlignClasses),
    ...geometryMapClasses(cardImageObjectFitClasses),
    ...geometryMapClasses(cardImageAspectRatioClasses),
    ...geometryMapClasses(toggleSizeClasses),
    ...(["sm", "md", "lg"] as const).flatMap((size) =>
      [false, true].flatMap((checked) =>
        classesOf(toggleThumbGeometryVariants({ size, checked })),
      ),
    ),
    ...Object.values(dividerThicknessClasses).flatMap((direction) => geometryMapClasses(direction)),
  ),
  textFlow: classesOf(
    ...Object.values(textWrapClasses),
    ...overflowValues.map((value) => `overflow-${value}`),
    ...overflowValues.map((value) => `overflow-x-${value}`),
    ...overflowValues.map((value) => `overflow-y-${value}`),
    "text-ellipsis",
    "text-clip",
    "whitespace-nowrap",
    "whitespace-normal",
  ),
} satisfies Record<string, readonly string[]>;

export const responsiveUtilities = [...new Set(Object.values(responsiveUtilityFamilies).flat())];

export function createResponsiveUtilitySource(
  breakpointOrder: readonly string[],
  utilities: readonly string[],
  fixedCandidates: readonly string[] = [],
): string {
  const prefixes = breakpointOrder
    .map((breakpoint) => (breakpoint === "base" ? "" : `${breakpoint}:`))
    .join(",");
  const groups = new Map<string, string[]>();

  for (const utility of new Set(utilities)) {
    const quote = utility.includes('"') ? "'" : '"';
    if (utility.includes(quote)) {
      throw new TypeError(`Cannot serialize a utility containing both quote types: ${utility}`);
    }

    const group = groups.get(quote) ?? [];
    group.push(utility);
    groups.set(quote, group);
  }

  // Tailwind reads inline candidates literally, including backslash escapes.
  const fixedGroups = new Map<string, string[]>();
  for (const candidate of new Set(fixedCandidates)) {
    const quote = candidate.includes('"') ? "'" : '"';
    if (candidate.includes(quote)) {
      throw new TypeError(`Cannot serialize a utility containing both quote types: ${candidate}`);
    }
    const group = fixedGroups.get(quote) ?? [];
    group.push(candidate);
    fixedGroups.set(quote, group);
  }

  const fixedDirectives = [...fixedGroups].map(
    ([quote, candidates]) => `@source inline(${quote}${candidates.join(" ")}${quote});`,
  );

  const directives = [...groups].map(
    ([quote, candidates]) =>
      `@source inline(${quote}{${prefixes}}{${candidates.join(",")}}${quote});`,
  );

  return `/* Auto-generated \u2014 run \`pnpm generate:layout-utilities\` in packages/core to regenerate. */

${[...directives, ...fixedDirectives].join("\n")}
`;
}

export function isUtilitySourceCurrent(outputPath: string, source: string): boolean {
  return (
    existsSync(outputPath) && readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n") === source
  );
}
