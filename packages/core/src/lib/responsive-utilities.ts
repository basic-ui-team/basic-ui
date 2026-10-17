import { existsSync, readFileSync } from "node:fs";
import { tokens } from "../../../tokens/src/generated/tokens";

function utilitiesFor(prefixes: readonly string[], values: readonly (string | number)[]): string[] {
  return prefixes.flatMap((prefix) => values.map((value) => `${prefix}-${value}`));
}

const spacing = Object.keys(tokens.spacing);
const numericDimensions = Array.from({ length: 25 }, (_, index) => index / 2);
const fractionalSpacing = [0.5, 1.5, 2.5, 3.5];
const dimensions = [...new Set([...spacing, ...numericDimensions]), "auto", "full", "screen", "min", "max", "fit"];
const borderWidths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const gridTracks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const responsiveUtilityFamilies = {
  spacing: utilitiesFor(
    [
      "p",
      "px",
      "py",
      "pt",
      "pr",
      "pb",
      "pl",
      "m",
      "mx",
      "my",
      "mt",
      "mr",
      "mb",
      "ml",
      "gap",
      "gap-x",
      "gap-y",
    ],
    [...spacing, ...fractionalSpacing],
  ),
  sizing: [
    ...utilitiesFor(["h", "min-h", "w", "min-w"], dimensions),
    ...utilitiesFor(
      ["max-h", "max-w"],
      [...new Set([...spacing, ...numericDimensions]), "none", "full", "screen", "min", "max", "fit"],
    ),
  ],
  pixelGeometry: [
    ...utilitiesFor(["h", "w"], [12, 14, 16, 20, 24, 32, 36, 44].map((value) => `[${value}px]`)),
    "p-[2px]",
    ...utilitiesFor(["translate-x", "translate-y"], [16, 18, 24].map((value) => `[${value}px]`)),
  ],
  borderWidth: utilitiesFor(
    ["border", "border-x", "border-y", "border-t", "border-r", "border-b", "border-l"],
    borderWidths,
  ),
  radius: utilitiesFor(["rounded"], Object.keys(tokens.radius)),
  translation: utilitiesFor(["translate-x", "translate-y"], [...new Set([...spacing, ...numericDimensions]), "1/2", "full"]),
  display: [
    "block",
    "inline",
    "inline-block",
    "hidden",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
  ],
  flex: utilitiesFor(
    ["flex"],
    ["row", "col", "row-reverse", "col-reverse", "nowrap", "wrap", "wrap-reverse"],
  ),
  alignment: [
    ...utilitiesFor(
      ["justify", "content"],
      ["start", "end", "center", "between", "around", "evenly", "stretch"],
    ),
    ...utilitiesFor(["items", "justify-items"], ["start", "end", "center", "stretch"]),
  ],
  grid: [
    ...utilitiesFor(["grid-cols", "grid-rows"], [...gridTracks, "none"]),
    ...utilitiesFor(["grid-flow"], ["row", "col", "dense", "row-dense", "col-dense"]),
    ...utilitiesFor(["auto-cols", "auto-rows"], ["auto", "min", "max", "fr"]),
  ],
  gridTemplates: [
    "grid-cols-[200px_1fr]",
    "grid-cols-[1fr_400px]",
    "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
    "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
    "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
    "grid-cols-[200px_1fr_300px]",
  ],
  typography: [
    ...utilitiesFor(["text"], Object.keys(tokens.fontSize)),
    ...utilitiesFor(["leading"], Object.keys(tokens.lineHeight)),
    ...utilitiesFor(
      ["text"],
      ["left", "center", "right", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"],
    ),
    "truncate",
    "whitespace-normal",
    "whitespace-nowrap",
  ],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  overflow: utilitiesFor(
    ["overflow", "overflow-x", "overflow-y"],
    ["visible", "hidden", "auto", "scroll"],
  ),
  media: [
    ...utilitiesFor(["object"], ["cover", "contain", "fill", "none", "scale-down"]),
    ...utilitiesFor(["aspect"], ["auto", "square", "video", "[4/3]", "[3/4]"]),
  ],
} satisfies Record<string, readonly string[]>;

export const responsiveUtilities = [...new Set(Object.values(responsiveUtilityFamilies).flat())];

export function createResponsiveUtilitySource(
  breakpointOrder: readonly string[],
  utilities: readonly string[],
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
  const directives = [...groups].map(
    ([quote, candidates]) =>
      `@source inline(${quote}{${prefixes}}{${candidates.join(",")}}${quote});`,
  );

  return `/* Auto-generated \u2014 run \`pnpm generate:layout-utilities\` in packages/core to regenerate. */

${directives.join("\n")}
`;
}

export function isUtilitySourceCurrent(outputPath: string, source: string): boolean {
  return (
    existsSync(outputPath) && readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n") === source
  );
}
