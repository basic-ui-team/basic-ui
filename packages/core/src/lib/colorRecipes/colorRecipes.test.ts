import { describe, expect, it } from "vitest";
import { cr, PALETTE_FAMILIES, type PaletteColor } from "./colorRecipes";

const solidRecipe = {
  bg: {
    value: "700",
    hover: { value: "600" },
    active: { value: "800" },
  },
  text: { value: "white" },
  border: { value: "700" },
} as const;

describe("cr", () => {
  it("resolves base, hover, and active variables for a palette family", () => {
    const cooked = cr("teal", solidRecipe);
    expect(cooked.style["--cr-bg"]).toBe("var(--color-teal-700)");
    expect(cooked.style["--cr-bg-hover"]).toBe("var(--color-teal-600)");
    expect(cooked.style["--cr-bg-active"]).toBe("var(--color-teal-800)");
    expect(cooked.style["--cr-text"]).toBe("var(--color-white)");
    expect(cooked.style["--cr-border"]).toBe("var(--color-teal-700)");
  });

  it("falls back to the base value for omitted states", () => {
    const cooked = cr("rose", { text: { value: "600" } });
    expect(cooked.style["--cr-text-hover"]).toBe("var(--color-rose-600)");
    expect(cooked.style["--cr-text-active"]).toBe("var(--color-rose-600)");
  });

  it("returns complete static utility candidates per channel", () => {
    const cooked = cr("teal", solidRecipe);
    expect(cooked.className).toContain("bg-(--cr-bg)");
    expect(cooked.className).toContain("hover:bg-(--cr-bg-hover)");
    expect(cooked.className).toContain("active:bg-(--cr-bg-active)");
    expect(cooked.className).toContain("text-(color:--cr-text)");
    expect(cooked.className).toContain("border border-(--cr-border)");
  });

  it("encodes opacity as a color-mix instead of interpolating utilities", () => {
    const cooked = cr("emerald", {
      bg: { value: "700", opacity: 85, hover: { value: "600" } },
    });
    expect(cooked.style["--cr-bg"]).toBe(
      "color-mix(in oklab, var(--color-emerald-700) 85%, transparent)",
    );
    // State opacity falls back to the base opacity.
    expect(cooked.style["--cr-bg-hover"]).toBe(
      "color-mix(in oklab, var(--color-emerald-600) 85%, transparent)",
    );
  });

  it("supports white and black without a shade", () => {
    const cooked = cr("teal", { text: { value: "black" } });
    expect(cooked.style["--cr-text"]).toBe("var(--color-black)");
  });

  it("rejects unsupported palette families", () => {
    // Runtime guard exists for JS consumers and dynamic values; typed callers
    // are already constrained by the PaletteColor union.
    expect(() => cr("notacolor" as PaletteColor, solidRecipe)).toThrowError(
      /Unsupported palette color/,
    );
  });

  it("rejects opacity outside 0-100", () => {
    expect(() => cr("teal", { bg: { value: "700", opacity: 120 } })).toThrowError(
      /between 0 and 100/,
    );
  });

  it("supports the brand families defined by the generated theme", () => {
    expect(PALETTE_FAMILIES).toContain("primary");
    const cooked = cr("primary", { bg: { value: "700" } });
    expect(cooked.style["--cr-bg"]).toBe("var(--color-primary-700)");
  });
});
