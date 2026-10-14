import { describe, expect, it } from "vitest";
import { createLayoutUtilitySource, getLayoutUtilityCandidates } from "./layout-utility-source";

describe("layout utility source", () => {
  it("derives unique candidates from the layout variant configuration", () => {
    const candidates = getLayoutUtilityCandidates();

    expect(candidates).toContain("p-0");
    expect(candidates).toContain("p-9");
    expect(candidates).toContain("overflow-x-scroll");
    expect(candidates).toContain("min-h-screen");
    expect(candidates).not.toContain("");
    expect(new Set(candidates).size).toBe(candidates.length);
  });

  it("generates responsive Tailwind source for every canonical breakpoint", () => {
    expect(createLayoutUtilitySource(["base", "sm", "md"])).toContain(
      '@source inline("{,sm:,md:}{',
    );
  });
});
