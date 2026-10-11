import { describe, expect, it } from "vitest";
import { darkTheme } from "./dark";

describe("darkTheme", () => {
  it("defines accessible semantic color roles", () => {
    expect(darkTheme.color).toMatchObject({
      bg: {
        error: "var(--color-red-950)",
        success: "var(--color-green-950)",
        warning: "var(--color-amber-950)",
        info: "var(--color-blue-950)",
      },
      fg: {
        error: "var(--color-red-200)",
        success: "var(--color-green-400)",
        warning: "var(--color-amber-400)",
        info: "var(--color-blue-200)",
      },
      border: {
        error: "var(--color-red-500)",
        success: "var(--color-green-500)",
        warning: "var(--color-amber-500)",
        info: "var(--color-blue-500)",
      },
    });
  });
});
