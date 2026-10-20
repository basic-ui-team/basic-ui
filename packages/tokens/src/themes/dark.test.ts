import { describe, expect, it } from "vitest";
import { darkTheme } from "./dark";

describe("darkTheme", () => {
  it("defines structural semantic color roles", () => {
    expect(darkTheme.color).toMatchObject({
      bg: {
        base: "var(--color-black)",
        inverted: "var(--color-white)",
      },
      fg: {
        base: "var(--color-white)",
        inverted: "var(--color-black)",
      },
      border: {
        base: "var(--color-neutral-700)",
        inverted: "var(--color-neutral-100)",
      },
    });
  });
});
