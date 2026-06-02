import { describe, expect, it } from "vitest";
import { themeToCSSVariables } from "./themeToCSSVariables";
import type ThemeConfig from "../types/index";

describe("themeToCSSVariables", () => {
  it("flattens a single category with correct CSS variable prefix", () => {
    const theme: ThemeConfig = {
      color: { primary: { "500": "hsl(119 43% 52%)" } },
    };

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--color-primary-500": "hsl(119 43% 52%)",
    });
  });

  it("flattens multiple categories with their respective prefixes", () => {
    const theme: ThemeConfig = {
      color: { primary: { "500": "#FF0000" } },
      spacing: { md: "1rem" },
      radius: { lg: "0.5rem" },
    };

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--color-primary-500": "#FF0000",
      "--spacing-md": "1rem",
      "--radius-lg": "0.5rem",
    });
  });

  it("handles numeric token values", () => {
    const theme: ThemeConfig = {
      fontWeight: { bold: 700 },
      zIndex: { modal: 45 },
      opacity: { disabled: 0.5 },
    };

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--font-weight-bold": 700,
      "--z-modal": 45,
      "--opacity-disabled": 0.5,
    });
  });

  it("skips null and undefined values", () => {
    const theme: ThemeConfig = {
      color: {
        primary: { "500": "hsl(119 43% 52%)" },
        secondary: { "500": null as any },
        accent: { "500": undefined as any },
      },
    };

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--color-primary-500": "hsl(119 43% 52%)",
    });
    expect(Object.keys(result.customProperties)).toHaveLength(1);
  });

  it("ignores categories not in PREFIX_MAP", () => {
    const theme = {
      color: { "primary-500": "red" },
      unknown: { value: "ignored" }, // Not in PREFIX_MAP
    } as ThemeConfig;

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--color-primary-500": "red",
    });
  });

  it("returns empty object for empty theme", () => {
    const result = themeToCSSVariables({});

    expect(result.customProperties).toEqual({});
  });

  it("handles multi-word token keys correctly", () => {
    const theme: ThemeConfig = {
      color: {
        bg: { base: "hsl(210 20% 97%)" },
        fg: { base: "hsl(119 43% 35%)" },
      },
    };

    const result = themeToCSSVariables(theme);

    expect(result.customProperties).toEqual({
      "--color-bg-base": "hsl(210 20% 97%)",
      "--color-fg-base": "hsl(119 43% 35%)",
    });
  });

  describe("tokens mirror & cache", () => {
    it("returns a tokens mirror and caches results by theme object identity", () => {
      const theme: ThemeConfig = {
        color: { primary: { "500": "#FF0000" } },
        spacing: { md: "1rem" },
      };

      const first = themeToCSSVariables(theme);

      // tokens mirror should contain compact token names
      expect(first.tokens).toEqual({
        color: { primary: { "500": "primary-500" } },
        spacing: { md: "md" },
      });

      // second call with the same object should return the cached object (same reference)
      const second = themeToCSSVariables(theme);
      expect(second).toBe(first);

      // but a deep-equal clone (different identity) should not return the same cached reference
      const clone = JSON.parse(JSON.stringify(theme)) as ThemeConfig;
      const third = themeToCSSVariables(clone);
      expect(third).not.toBe(first);
      // values should still be equivalent
      expect(third.customProperties).toEqual(first.customProperties);
    });

    it("preserves nested token naming for multi-word keys in tokens mirror", () => {
      const theme: ThemeConfig = {
        color: {
          bg: { base: "hsl(210 20% 97%)" },
          fg: { base: "hsl(119 43% 35%)" },
        },
      };

      const result = themeToCSSVariables(theme);
      expect(result.tokens.color.bg.base).toBe("bg-base");
      expect(result.tokens.color.fg.base).toBe("fg-base");
    });
  });
});
