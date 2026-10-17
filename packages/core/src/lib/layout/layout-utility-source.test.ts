import { describe, expect, it } from "vitest";
import {
  createLayoutUtilitySource,
  getFlexUtilityCandidates,
  getLayoutUtilityCandidates,
} from "./layout-utility-source";

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

  it("includes the dynamic Flex utilities in the responsive source", () => {
    const candidates = getFlexUtilityCandidates();

    expect(candidates).toContain("flex-row");
    expect(candidates).toContain("flex-wrap");
    expect(candidates).toContain("inline-flex");
  });

  it("generates responsive Tailwind source for every canonical breakpoint", () => {
    const source = createLayoutUtilitySource(["base", "sm", "md"]);

    expect(source).toContain('@source inline("{,sm:,md:}{');
    expect(source).toContain("flex-row");
  });
});
