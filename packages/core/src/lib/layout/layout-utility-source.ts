import { layoutVariantsConfig } from "./layout.variants";
import { flexVariantsConfig } from "../../components/Flex/flex.variants";

function getVariantUtilityCandidates(
  variants: Record<string, Record<string, string>>,
): string[] {
  return [
    ...new Set(
      Object.values(variants)
        .flatMap((variant) => Object.values(variant))
        .flatMap((className) => className.split(/\s+/))
        .filter(Boolean),
    ),
  ];
}

export function getLayoutUtilityCandidates(): string[] {
  return getVariantUtilityCandidates(layoutVariantsConfig.variants);
}

export function getFlexUtilityCandidates(): string[] {
  return getVariantUtilityCandidates(flexVariantsConfig.variants);
}

export function createLayoutUtilitySource(breakpointOrder: readonly string[]): string {
  const prefixes = breakpointOrder.map((breakpoint) =>
    breakpoint === "base" ? "" : `${breakpoint}:`,
  ).join(",");
  const candidates = [...new Set([
    ...getLayoutUtilityCandidates(),
    ...getFlexUtilityCandidates(),
  ])].join(",");

  return `/* Auto-generated — run \`pnpm generate:layout-utilities\` in packages/core to regenerate. */

@source inline("{${prefixes}}{${candidates}}");
`;
}
