import { describe, expect, it } from "vitest";
import {
  createResponsiveUtilitySource,

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
  // The committed stylesheet is guarded against drift by
  // `pnpm check:layout-utilities` (the generator's --check mode); these
  // tests cover the serializer's own behavior.

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

// The committed stylesheet's freshness is guarded by
// `pnpm check:layout-utilities` (the generator's --check mode), which
// regenerates from the same vocabulary and fixed candidates.
