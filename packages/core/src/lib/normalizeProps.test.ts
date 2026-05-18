import { describe, expect, it } from "vitest";
import { normalizeProps } from "./normalizeProps";

describe("normalizeProps", () => {
  it("maps ariaLabel to aria-label when dashed attribute is not present", () => {
    const original = { ariaLabel: "hello", foo: "bar" } as Record<string, unknown>;
    const result = normalizeProps(original);
    expect(result["aria-label"]).toBe("hello");
    expect((result as any).ariaLabel).toBeUndefined();
    // original remains unchanged
    expect((original as any).ariaLabel).toBe("hello");
  });

  it("preserves existing aria-label and leaves ariaLabel when both provided", () => {
    const original = { "aria-label": "label", ariaLabel: "camel" } as Record<string, unknown>;
    const result = normalizeProps(original);
    expect(result["aria-label"]).toBe("label");
    expect((result as any).ariaLabel).toBe("camel");
  });

  it("does not mutate the input object and returns a new reference", () => {
    const original = { ariaLabel: "a" } as Record<string, unknown>;
    const result = normalizeProps(original);
    expect(result).not.toBe(original);
    expect((original as any).ariaLabel).toBe("a");
  });
});
