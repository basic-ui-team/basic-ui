import { describe, it, expect } from "vitest";
import { generateLayoutClassNames, splitLayoutProps } from "./layout-utils";
import type { LayoutProps } from "./layout.types";

describe("Layout utils", () => {
  describe("splitLayoutProps", () => {
    it("separates layout props from rest", () => {
      const props = {
        p: 2,
        mx: 4,
        position: "relative",
        display: "inline",
        overflow: "hidden",
        id: "my-id",
        "data-test": "x",
      } as Record<string, unknown>;

      const { layout, rest } = splitLayoutProps(props);

      expect(layout.p).toBe(2);
      expect(layout.mx).toBe(4);
      expect(layout.position).toBe("relative");
      expect(layout.display).toBe("inline");
      expect(layout.overflow).toBe("hidden");

      expect((rest as Record<string, unknown>).id).toBe("my-id");
      expect((rest as Record<string, unknown>)["data-test"]).toBe("x");
    });

    it("returns empty objects when given undefined", () => {
      const { layout, rest } = splitLayoutProps(undefined);
      expect(layout).toEqual({});
      expect(rest).toEqual({});
    });

    it("preserves falsy values and does not mutate the original props", () => {
      const props = Object.freeze({ p: 0, display: "none", hidden: false, id: "box" });

      expect(splitLayoutProps(props)).toEqual({
        layout: { p: 0, display: "none" },
        rest: { hidden: false, id: "box" },
      });
      expect(props).toEqual({ p: 0, display: "none", hidden: false, id: "box" });
    });

  });

  describe("layout variant mapping", () => {
    it.each([
      { layout: { p: 2 }, expected: "p-2" },
      { layout: { px: 2 }, expected: "px-2" },
      { layout: { py: 2 }, expected: "py-2" },
      { layout: { pt: 2 }, expected: "pt-2" },
      { layout: { pr: 2 }, expected: "pr-2" },
      { layout: { pb: 2 }, expected: "pb-2" },
      { layout: { pl: 2 }, expected: "pl-2" },
      { layout: { m: 2 }, expected: "m-2" },
      { layout: { mx: 2 }, expected: "mx-2" },
      { layout: { my: 2 }, expected: "my-2" },
      { layout: { mt: 2 }, expected: "mt-2" },
      { layout: { mr: 2 }, expected: "mr-2" },
      { layout: { mb: 2 }, expected: "mb-2" },
      { layout: { ml: 2 }, expected: "ml-2" },
      { layout: { gap: 2 }, expected: "gap-2" },
      { layout: { h: "full" }, expected: "h-full" },
      { layout: { hMin: "min" }, expected: "min-h-min" },
      { layout: { hMax: "screen" }, expected: "max-h-screen" },
      { layout: { w: "fit" }, expected: "w-fit" },
      { layout: { wMin: "max" }, expected: "min-w-max" },
      { layout: { wMax: "full" }, expected: "max-w-full" },
      { layout: { display: "none" }, expected: "hidden" },
      { layout: { position: "sticky" }, expected: "sticky" },
      { layout: { overflow: "auto" }, expected: "overflow-auto" },
      { layout: { overflowX: "hidden" }, expected: "overflow-x-hidden" },
      { layout: { overflowY: "scroll" }, expected: "overflow-y-scroll" },
    ] satisfies { layout: LayoutProps; expected: string }[])(
      "maps $expected without adding defaults",
      ({ layout, expected }) => {
        expect(generateLayoutClassNames(layout).layoutClassNameString).toBe(expected);
      },
    );

    it("maps responsive sizing and overflow independently in canonical breakpoint order", () => {
      expect(
        generateLayoutClassNames({
          hMin: { lg: "screen", base: "min", md: "full" },
          overflowY: { base: "hidden", xl: "auto" },
        }).layoutClassNameString,
      ).toBe("min-h-min md:min-h-full lg:min-h-screen overflow-y-hidden xl:overflow-y-auto");
    });
  });

  describe("generateLayoutClassNames", () => {
    it("applies token classes for provided layout props", () => {
      expect(
        generateLayoutClassNames({
          p: 2,
          m: 3,
          position: "relative",
          overflow: "hidden",
        }).layoutClassNameString,
      ).toBe("p-2 m-3 relative overflow-hidden");
    });

    it("does not emit defaults for empty layout props", () => {
      expect(generateLayoutClassNames({}).layoutClassNameString).toBe("");
    });

    it("emits static responsive classes", () => {
      expect(
        generateLayoutClassNames({
          p: { base: 1, md: 4 },
          display: { base: "block", md: "inline" },
        }).layoutClassNameString,
      ).toBe("p-1 md:p-4 block md:inline");
    });

    it("respects `unset` to avoid emitting token class", () => {
      expect(
        generateLayoutClassNames({ p: "unset", m: "unset" }).layoutClassNameString,
      ).toBe("");
    });
  });
});
