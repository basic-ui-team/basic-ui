import { describe, expect, it } from "vitest";
import { lightTheme } from "./light";

describe("lightTheme", () => {
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
