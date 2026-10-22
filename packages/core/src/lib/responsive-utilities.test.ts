import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BREAKPOINT_ORDER } from "../../../react-utilities/src/hooks/useResponsive/constants";
import { colorRecipeUtilityCandidates } from "./colorRecipes/colorRecipes";
import {
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  responsiveUtilities,
  responsiveUtilityFamilies,
} from "./responsive-utilities";

describe("shared responsive vocabulary", () => {
  it("derives the flex family from the Flex variants table", () => {
    expect(responsiveUtilityFamilies.flex).toEqual(
      expect.arrayContaining(["flex-row", "flex-col", "flex-row-reverse", "flex-col-reverse"]),
    );
    expect(responsiveUtilityFamilies.flex).toEqual(
      expect.arrayContaining(["flex-nowrap", "flex-wrap", "flex-wrap-reverse"]),
    );
    expect(responsiveUtilityFamilies.flex).toEqual(
      expect.arrayContaining(["flex", "inline-flex"]),
    );
  });

  it("derives the grid family from the Grid variants table", () => {
    for (let tracks = 1; tracks <= 12; tracks++) {
      expect(responsiveUtilityFamilies.grid).toContain(`grid-cols-${tracks}`);
      expect(responsiveUtilityFamilies.grid).toContain(`grid-rows-${tracks}`);
    }
    expect(responsiveUtilityFamilies.grid).toEqual(
      expect.arrayContaining(["grid-flow-row", "grid-flow-dense", "auto-cols-fr", "auto-rows-min"]),
    );
    expect(responsiveUtilityFamilies.grid).toEqual(
      expect.arrayContaining(["items-start", "justify-items-center", "content-between", "justify-evenly"]),
    );
  });

  it("keeps every template preset class responsive", () => {
    expect(responsiveUtilityFamilies.gridTemplates).toEqual(
      expect.arrayContaining([
        "grid-cols-none",
        "grid-rows-none",
        "grid-cols-[200px_1fr]",
        "grid-cols-[1fr_400px]",
        "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
      ]),
    );
  });

  it("collects the responsive component geometry maps", () => {
    expect(responsiveUtilityFamilies.componentGeometry).toEqual(
      expect.arrayContaining(["px-2", "py-1", "text-sm", "rounded-md"]),
    );
    expect(responsiveUtilityFamilies.componentGeometry).toContain("border-t-2");
  });

  it("covers the text-flow overflow and truncation utilities", () => {
    for (const value of ["visible", "hidden", "auto", "scroll"]) {
      expect(responsiveUtilityFamilies.textFlow).toContain(`overflow-${value}`);
      expect(responsiveUtilityFamilies.textFlow).toContain(`overflow-x-${value}`);
      expect(responsiveUtilityFamilies.textFlow).toContain(`overflow-y-${value}`);
    }
    expect(responsiveUtilityFamilies.textFlow).toEqual(
      expect.arrayContaining([
        "text-ellipsis",
        "text-clip",
        "whitespace-nowrap",
        "whitespace-normal",
        "text-nowrap",
        "text-balance",
        "text-pretty",
        "text-wrap",
      ]),
    );
  });

  it("stays scoped to runtime-constructed classes only", () => {
    // Spacing, sizing, and position are className concerns since the layout
    // props were removed; their utilities must not re-enter the safelist.
    expect(responsiveUtilities).not.toContain("p-4");
    expect(responsiveUtilities).not.toContain("gap-4");
    expect(responsiveUtilities).not.toContain("h-full");
    expect(responsiveUtilities).not.toContain("relative");
  });

  it("contains only unique concrete utilities, without automatic modifiers", () => {
    expect(responsiveUtilities).toEqual([
      ...new Set(Object.values(responsiveUtilityFamilies).flat()),
    ]);
    expect(
      responsiveUtilities.every((utility) => utility.length > 0 && !/\s|:/.test(utility)),
    ).toBe(true);
  });
});

describe("responsive utility source", () => {
  it("matches the generated stylesheet from the shared vocabulary and recipe candidates", () => {
    const source = createResponsiveUtilitySource(
      BREAKPOINT_ORDER,
      responsiveUtilities,
      colorRecipeUtilityCandidates,
    );
    const committed = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../generated/layout-utilities.generated.css",
      ),
      "utf8",
    );

    expect(source).toBe(committed.replace(/\r\n/g, "\n"));
  });

  it("emits only the supplied breakpoint forms and exact unique candidates", () => {
    const source = createResponsiveUtilitySource(["base", "md", "2xl"], ["h-4", "w-4", "h-4"]);

    expect(source).toContain('@source inline("{,md:,2xl:}{h-4,w-4}");');
    expect(source).not.toContain("sm:");
    expect(source).toBe(
      createResponsiveUtilitySource(["base", "md", "2xl"], ["h-4", "w-4", "h-4"]),
    );
  });

  it("quotes the inline source without changing utility contents", () => {
    const utility = 'data-[state="checked"]:h-4';
    const source = createResponsiveUtilitySource(["base", "md"], ["content-['saved']", utility]);

    expect(source).toContain(`@source inline("{,md:}{content-['saved']}");`);
    expect(source).toContain(`@source inline('{,md:}{${utility}}');`);
  });

  it("rejects mixed quotes rather than silently changing the utility", () => {
    expect(() =>
      createResponsiveUtilitySource(["base"], [`data-[label="it's"]:h-4`]),
    ).toThrow("Cannot serialize a utility containing both quote types");
  });
});

describe("responsive utility freshness", () => {
  it("reports the committed stylesheet as current", () => {
    const committed = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "../generated/layout-utilities.generated.css",
    );
    const source = createResponsiveUtilitySource(
      BREAKPOINT_ORDER,
      responsiveUtilities,
      colorRecipeUtilityCandidates,
    );

    expect(isUtilitySourceCurrent(committed, source)).toBe(true);
  });
});
