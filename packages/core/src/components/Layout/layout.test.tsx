import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { generateLayoutClassNames, splitLayoutProps, LAYOUT_PROP_NAMES } from "./layout";

describe("Layout utils", () => {
  describe("splitLayoutProps", () => {
    it("separates layout props from rest", () => {
      const props = {
        p: "sm",
        mx: "lg",
        position: "relative",
        overflow: "hidden",
        id: "my-id",
        "data-test": "x",
      } as Record<string, unknown>;

      const { layout, rest } = splitLayoutProps(props);

      expect(layout.p).toBe("sm");
      expect(layout.mx).toBe("lg");
      expect(layout.position).toBe("relative");
      expect(layout.overflow).toBe("hidden");

      expect((rest as any).id).toBe("my-id");
      expect((rest as any)["data-test"]).toBe("x");
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
      expect(LAYOUT_PROP_NAMES).toContain("position");
    });
  });

  describe("generateLayoutClassNames (via component render)", () => {
    const TestComp = ({ layout }: { layout?: Record<string, unknown> }) => {
      const classes = generateLayoutClassNames((layout as any) || {});
      return (
        <div data-testid="layout" className={classes as string}>
          x
        </div>
      );
    };

    it("applies token classes for provided layout props", () => {
      renderWithProviders(
        <TestComp layout={{ p: "sm", m: "md", position: "relative", overflow: "hidden" }} />,
      );

      const el = screen.getByTestId("layout");
      expect(el).toHaveClass("p-sm");
      expect(el).toHaveClass("m-md");
      expect(el).toHaveClass("relative");
      expect(el).toHaveClass("overflow-hidden");
    });

    it("uses merged defaults when props omitted", () => {
      renderWithProviders(<TestComp />);
      const el = screen.getByTestId("layout");

      // `generateLayoutClassNames` merges defaults defined in layout.ts
      // current default p is `md` and default margin is `none` -> `m-0`.
      expect(el).toHaveClass("p-md");
      expect(el).toHaveClass("m-0");
    });

    it("resolves responsive objects to base value", () => {
      renderWithProviders(<TestComp layout={{ p: { base: "xs", md: "lg" } }} />);
      const el = screen.getByTestId("layout");
      // test environment matchMedia mocks no matches -> base used
      expect(el).toHaveClass("p-xs");
    });

    it("respects `unset` to avoid emitting token class", () => {
      renderWithProviders(<TestComp layout={{ p: "unset", m: "unset" }} />);
      const el = screen.getByTestId("layout");

      expect(el.className).not.toMatch(/\bp-/);
      expect(el.className).not.toMatch(/\bm-/);
    });
  });
});

export {};
