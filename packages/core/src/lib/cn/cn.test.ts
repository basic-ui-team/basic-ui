import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn utility function", () => {
  it("merges classes correctly", () => {
    expect(cn("px-4 py-2", "px-6")).toContain("py-2 px-6");
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn("bg-blue-500", false && "bg-blue-700")).toBe("bg-blue-500");
    expect(cn("text-sm", "text-lg", "font-bold")).toBe("text-lg font-bold");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    expect(cn("bg-blue-500", isActive && "bg-blue-700")).toBe("bg-blue-700");
    expect(cn("bg-blue-500", !isActive && "bg-blue-700")).toBe("bg-blue-500");
  });

    it("handles falsy values gracefully", () => {
        expect(cn("text-sm", null, undefined, false, "font-bold")).toBe("text-sm font-bold");
    });
});