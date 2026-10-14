import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { generateLayoutClassNames, splitLayoutProps, LAYOUT_PROP_NAMES } from "./layout-utils";
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

    it("LAYOUT_PROP_NAMES contains expected keys", () => {
      expect(Array.isArray(LAYOUT_PROP_NAMES)).toBe(true);
      expect(LAYOUT_PROP_NAMES).toContain("p");
      expect(LAYOUT_PROP_NAMES).toContain("m");
      expect(LAYOUT_PROP_NAMES).toContain("display");
      expect(LAYOUT_PROP_NAMES).toContain("position");
    });
  });

  describe("generateLayoutClassNames (via component render)", () => {
    const TestComp = ({ layout }: { layout?: LayoutProps }) => {
      const { layoutClassNameString } = generateLayoutClassNames(layout ?? {});
      return (
        <div data-testid="layout" className={layoutClassNameString}>
          x
        </div>
      );
    };

    it("applies token classes for provided layout props", () => {
      renderWithProviders(
        <TestComp layout={{ p: 2, m: 3, position: "relative", overflow: "hidden" }} />,
      );

      const el = screen.getByTestId("layout");
      expect(el).toHaveClass("p-2");
      expect(el).toHaveClass("m-3");
      expect(el).toHaveClass("relative");
      expect(el).toHaveClass("overflow-hidden");
    });

    it("does not emit layout classes when props are omitted", () => {
      renderWithProviders(<TestComp />);
      const el = screen.getByTestId("layout");

      expect(el).not.toHaveClass("p-0", "m-0", "block", "static");
    });

    it("emits static responsive classes", () => {
      renderWithProviders(
        <TestComp layout={{ p: { base: 1, md: 4 }, display: { base: "block", md: "inline" } }} />,
      );
      const el = screen.getByTestId("layout");

      expect(el).toHaveClass("p-1");
      expect(el).toHaveClass("md:p-4");
      expect(el).toHaveClass("block");
      expect(el).toHaveClass("md:inline");
    });

    it("respects `unset` to avoid emitting token class", () => {
      renderWithProviders(<TestComp layout={{ p: "unset", m: "unset" }} />);
      const el = screen.getByTestId("layout");

      expect(el.className).not.toMatch(/\bp-/);
      expect(el.className).not.toMatch(/\bm-/);
    });

    it("handles undefined layout without emitting defaults", () => {
      renderWithProviders(<TestComp layout={undefined} />);
      const el = screen.getByTestId("layout");
      
      expect(el).not.toHaveClass("p-0", "m-0", "block", "static");
    });
  });
});

export {};
