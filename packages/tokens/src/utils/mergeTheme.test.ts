import { describe, expect, it } from "vitest";
import { mergeTheme } from "./mergeTheme";
import type { ThemeConfig } from "../types";

const baseTheme: ThemeConfig = {
  color: {
    "background-secondary": "hsl(210 20% 97%)",
    "primary-50": "hsl(119 43% 52%)",
    "foreground-primary": "hsl(210 10% 18%)",
  },
  spacing: { md: "1rem", sm: "0.5rem", lg: "1.5rem" },
  radius: { md: "0.375rem", sm: "0.25rem" },
  shadow: { s2: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  fontSize: { md: "1rem", sm: "0.875rem" },
  fontWeight: { bold: 700, normal: 400 },
  lineHeight: { normal: 1.45, tight: 1.15 },
  letterSpacing: { normal: "0.01em", tight: "-0.04em" },
  fontFamily: { sans: "system-ui, sans-serif", mono: "monospace" },
  duration: { normal: "200ms", fast: "100ms" },
  easing: { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)" },
  zIndex: { modal: 45, dropdown: 40 },
  breakpoint: { md: "42rem", sm: "28rem" },
  opacity: { disabled: 0.5 },
};

describe("mergeTheme", () => {
  it.each<[string, Partial<ThemeConfig>]>([
    ["color", { color: { "primary-50": "#FF0000" } }],
    ["spacing", { spacing: { md: "1.5rem" } }],
    ["fontSize", { fontSize: { md: "1.125rem" } }],
    ["fontWeight", { fontWeight: { bold: 800 } }],
    ["radius", { radius: { md: "0.5rem" } }],
    ["shadow", { shadow: { s2: "custom shadow" } }],
    ["fontFamily", { fontFamily: { sans: "Inter, sans-serif" } }],
    ["duration", { duration: { fast: "50ms" } }],
    ["easing", { easing: { in: "ease-in" } }],
    ["zIndex", { zIndex: { modal: 100 } }],
    ["breakpoint", { breakpoint: { md: "48rem" } }],
    ["opacity", { opacity: { disabled: 0.3 } }],
  ])("merges %s overrides correctly", (_category, override) => {
    const result = mergeTheme(baseTheme, override);
    const categoryName = Object.keys(override)[0] as keyof ThemeConfig;
    const overrideValues = override[categoryName] as Record<string, any>;
    const baseValues = baseTheme[categoryName] as Record<string, any>;

    // Check merged values are applied
    Object.entries(overrideValues).forEach(([key, value]) => {
      expect((result[categoryName] as any)[key]).toBe(value);
    });

    // Check base values are preserved
    if (baseValues) {
      Object.keys(baseValues).forEach((key) => {
        if (!(key in overrideValues)) {
          expect((result[categoryName] as any)[key]).toBe(baseValues[key]);
        }
      });
    }
  });

  it("handles empty override", () => {
    expect(mergeTheme(baseTheme, {})).toEqual(baseTheme);
  });

  it("preserves base values across multiple categories", () => {
    const result = mergeTheme(baseTheme, { color: { "primary-50": "#FF0000" } });
    expect(result.spacing).toEqual(baseTheme.spacing);
    expect(result.radius).toEqual(baseTheme.radius);
  });

  it("merges multiple categories simultaneously", () => {
    const override = {
      color: { "primary-50": "#0066FF" },
      spacing: { md: "2rem" },
      fontSize: { md: "1.125rem" },
    };
    const result = mergeTheme(baseTheme, override);
    expect(result.color?.["primary-50"]).toBe("#0066FF");
    expect(result.spacing?.md).toBe("2rem");
    expect(result.fontSize?.md).toBe("1.125rem");
  });
});
