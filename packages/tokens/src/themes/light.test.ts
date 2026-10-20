import { describe, expect, it } from "vitest";
import { lightTheme } from "./light";

describe("lightTheme", () => {
  it("defines structural semantic color roles", () => {
    expect(lightTheme.color).toMatchObject({
      bg: {
        base: "var(--color-white)",
        muted: "var(--color-neutral-50)",
        inverted: "var(--color-black)",
      },
      fg: {
        base: "var(--color-black)",
        muted: "var(--color-neutral-700)",
        inverted: "var(--color-white)",
      },
      border: {
        base: "var(--color-neutral-200)",
        inverted: "var(--color-neutral-700)",
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
