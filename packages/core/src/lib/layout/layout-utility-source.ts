import { layoutVariantsConfig } from "./layout.variants";

export function getLayoutUtilityCandidates(): string[] {
  return [
    ...new Set(
      Object.values(layoutVariantsConfig.variants)
        .flatMap((variant) => Object.values(variant))
        .flatMap((className) => className.split(/\s+/))
        .filter(Boolean),
    ),
  ];
}

export function createLayoutUtilitySource(breakpointOrder: readonly string[]): string {
  const prefixes = breakpointOrder.map((breakpoint) =>
    breakpoint === "base" ? "" : `${breakpoint}:`,
  ).join(",");
  const candidates = getLayoutUtilityCandidates().join(",");

  return `/* Auto-generated — run \`pnpm generate:layout-utilities\` in packages/core to regenerate. */

@source inline("{${prefixes}}{${candidates}}");
`;
}
