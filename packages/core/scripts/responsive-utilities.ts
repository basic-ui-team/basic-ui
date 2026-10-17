import { existsSync, readFileSync } from "node:fs";

export interface ResponsiveUtilitySource {
  readonly base?: string;
  readonly variants: Readonly<Record<string, Readonly<Record<string, string>>>>;
  readonly compoundVariants?: readonly (Readonly<Record<string, unknown>> & {
    readonly class?: string;
    readonly className?: string;
  })[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function collectResponsiveUtilities(sources: readonly unknown[]): string[] {
  const utilities = new Set<string>();

  function addClasses(value: unknown, location: string) {
    if (typeof value !== "string") {
      throw new TypeError(`${location} must be a class string.`);
    }

    for (const utility of value.split(/\s+/).filter(Boolean)) {
      utilities.add(utility);
    }
  }

  sources.forEach((source, index) => {
    const location = `Responsive source ${index + 1}`;

    if (!isRecord(source) || !isRecord(source.variants)) {
      throw new TypeError(`${location}.variants must be a record of variant maps.`);
    }

    if (source.base !== undefined) {
      addClasses(source.base, `${location}.base`);
    }

    for (const [name, values] of Object.entries(source.variants)) {
      if (!isRecord(values)) {
        throw new TypeError(`${location}.variants.${name} must be a variant map.`);
      }

      for (const [value, classes] of Object.entries(values)) {
        addClasses(classes, `${location}.variants.${name}.${value}`);
      }
    }

    if (source.compoundVariants !== undefined) {
      if (!Array.isArray(source.compoundVariants)) {
        throw new TypeError(`${location}.compoundVariants must be an array.`);
      }

      source.compoundVariants.forEach((compound: unknown, compoundIndex: number) => {
        const compoundLocation = `${location}.compoundVariants[${compoundIndex}]`;

        if (!isRecord(compound) || !("class" in compound || "className" in compound)) {
          throw new TypeError(`${compoundLocation} must declare class or className.`);
        }

        for (const key of ["class", "className"]) {
          if (key in compound) {
            addClasses(compound[key], `${compoundLocation}.${key}`);
          }
        }
      });
    }
  });

  return [...utilities];
}

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
    existsSync(outputPath) &&
    readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n") === source
  );
}
