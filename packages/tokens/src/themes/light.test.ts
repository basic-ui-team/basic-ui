import { describe, expect, it } from "vitest";
import { lightTheme } from "./light";

describe("lightTheme", () => {
  it("defines accessible semantic color roles", () => {
    expect(lightTheme.color).toMatchObject({
      bg: {
        error: "var(--color-red-100)",
        success: "var(--color-green-100)",
        warning: "var(--color-amber-100)",
        info: "var(--color-blue-100)",
      },
      fg: {
        error: "var(--color-red-800)",
        success: "var(--color-green-800)",
        warning: "var(--color-amber-800)",
        info: "var(--color-blue-800)",
      },
      border: {
        error: "var(--color-red-500)",
        success: "var(--color-green-700)",
        warning: "var(--color-amber-700)",
        info: "var(--color-blue-500)",
      },
    });
  });

  it("defines the canonical semantic z-index ladder", () => {
    expect(lightTheme.zIndex).toEqual({
      base: 0,
      elevated: 10,
      docked: 20,
      dropdown: 1000,
      sticky: 1050,
      banner: 1100,
      overlay: 1150,
      modal: 1200,
      popover: 1250,
      toast: 1300,
      tooltip: 1400,
    });
  });
});
