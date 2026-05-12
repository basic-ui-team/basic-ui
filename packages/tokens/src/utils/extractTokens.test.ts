import { describe, expect, it } from "vitest";
import { extractTokens } from "./extractTokens";
import type { ThemeConfig } from "../types";

const mockTheme: ThemeConfig = {
  colors: { bg: "hsl(210 20% 97%)", primary: "hsl(119 43% 52%)" },
  spacing: { xs: "0.25rem", md: "1rem", lg: "1.5rem" },
  radius: { sm: "0.25rem", md: "0.375rem", lg: "0.5rem" },
  shadows: { sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  fontSize: { xs: "0.75rem", md: "1rem" },
  fontWeight: { normal: 400, bold: 700 },
  lineHeight: { tight: 1.15, normal: 1.45 },
  letterSpacing: { tight: "-0.04em", normal: "0.01em" },
  fontFamily: { sans: "system-ui, sans-serif", mono: "monospace" },
  duration: { fast: "100ms", normal: "200ms" },
  easing: { in: "cubic-bezier(0.4, 0, 1, 1)", out: "cubic-bezier(0, 0, 0.2, 1)" },
  zIndex: { modal: 45, tooltip: 50 },
  breakpoint: { sm: "28rem", md: "42rem" },
  opacity: { disabled: 0.5, muted: 0.7 },
};

describe("extractTokens", () => {
  it.each<[keyof ThemeConfig, string, string]>([
    ["colors", "color", "bg"],
    ["spacing", "spacing", "xs"],
    ["radius", "radius", "sm"],
    ["shadows", "shadow", "sm"],
    ["fontSize", "font-size", "xs"],
    ["fontWeight", "font-weight", "normal"],
    ["lineHeight", "line-height", "tight"],
    ["letterSpacing", "tracking", "tight"],
    ["fontFamily", "font", "sans"],
    ["duration", "duration", "fast"],
    ["easing", "ease", "in"],
    ["zIndex", "z", "modal"],
    ["breakpoint", "breakpoint", "sm"],
    ["opacity", "opacity", "disabled"],
  ])("category: %s uses %s prefix", (category, prefix, key) => {
    const result = extractTokens(mockTheme, category);
    const expectedKey = `${prefix}-${key}`;
    expect(result[expectedKey]).toBeDefined();
  });

  it("handles undefined category", () => {
    const theme: ThemeConfig = { spacing: mockTheme.spacing };
    expect(extractTokens(theme, "colors")).toEqual({});
  });

  it("handles empty category", () => {
    const theme: ThemeConfig = { colors: {} };
    expect(extractTokens(theme, "colors")).toEqual({});
  });

  it("handles numeric values correctly", () => {
    const result = extractTokens(mockTheme, "fontWeight");
    expect(typeof result["font-weight-normal"]).toBe("number");
    expect(result["font-weight-normal"]).toBe(400);
  });

  it("handles decimal values correctly", () => {
    const result = extractTokens(mockTheme, "lineHeight");
    expect(typeof result["line-height-tight"]).toBe("number");
    expect(result["line-height-tight"]).toBe(1.15);
  });
});
