import { describe, expect, it } from "vitest";
import { themeToCustomProperties } from "./themeToCustomProperties";
import type { ThemeConfig } from "../types";

describe("themeToCustomProperties", () => {
  it("flattens a single category with correct CSS variable prefix", () => {
    const theme: ThemeConfig = {
      color: { "primary-500": "hsl(119 43% 52%)" },
    };

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--color-primary-500": "hsl(119 43% 52%)",
    });
  });

  it("flattens multiple categories with their respective prefixes", () => {
    const theme: ThemeConfig = {
      color: { "primary-500": "#FF0000" },
      spacing: { "md": "1rem" },
      radius: { "lg": "0.5rem" },
    };

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--color-primary-500": "#FF0000",
      "--spacing-md": "1rem",
      "--radius-lg": "0.5rem",
    });
  });

  it("handles numeric token values", () => {
    const theme: ThemeConfig = {
      fontWeight: { "bold": 700 },
      zIndex: { "modal": 45 },
      opacity: { "disabled": 0.5 },
    };

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--font-weight-bold": 700,
      "--z-modal": 45,
      "--opacity-disabled": 0.5,
    });
  });

  it("skips null and undefined values", () => {
    const theme: ThemeConfig = {
      color: {
        "primary-500": "hsl(119 43% 52%)",
        "secondary-500": null as any,
        "accent-500": undefined as any,
      },
    };

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--color-primary-500": "hsl(119 43% 52%)",
    });
    expect(Object.keys(result)).toHaveLength(1);
  });

  it("ignores categories not in PREFIX_MAP", () => {
    const theme = {
      color: { "primary-500": "red" },
      unknown: { "value": "ignored" }, // Not in PREFIX_MAP
    } as ThemeConfig;

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--color-primary-500": "red",
    });
  });

  it("returns empty object for empty theme", () => {
    const result = themeToCustomProperties({});

    expect(result).toEqual({});
  });

  it("handles multi-word token keys correctly", () => {
    const theme: ThemeConfig = {
      color: {
        "background-primary": "hsl(210 20% 97%)",
        "foreground-link": "hsl(119 43% 35%)",
      },
    };

    const result = themeToCustomProperties(theme);

    expect(result).toEqual({
      "--color-background-primary": "hsl(210 20% 97%)",
      "--color-foreground-link": "hsl(119 43% 35%)",
    });
  });
});
