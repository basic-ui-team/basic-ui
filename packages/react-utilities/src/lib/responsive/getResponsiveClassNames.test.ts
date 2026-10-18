import { describe, expect, it } from "vitest";
import { getResponsiveClassNames } from "./getResponsiveClassNames";

describe("getResponsiveClassNames", () => {
  it("returns classes for a static value", () => {
    expect(getResponsiveClassNames(2, (value) => `p-${value}`)).toBe("p-2");
  });

  it("emits supplied responsive values in breakpoint order", () => {
    const classNames = getResponsiveClassNames(
      { "2xl": 6, base: 2, md: 4 },
      (value) => `p-${value} m-${value}`,
    );

    expect(classNames).toBe("p-2 m-2 md:p-4 md:m-4 2xl:p-6 2xl:m-6");
  });

  it("does not emit unspecified breakpoints or unresolved values", () => {
    const classNames = getResponsiveClassNames(
      { base: "visible", lg: "hidden", xl: "skip" },
      (value) => (value === "skip" ? undefined : `overflow-${value}`),
    );

    expect(classNames).toBe("overflow-visible lg:overflow-hidden");
  });

  it("preserves falsy values for the resolver", () => {
    expect(
      getResponsiveClassNames(
        { base: 0, sm: 2 },
        (value) => `p-${value}`,
      ),
    ).toBe("p-0 sm:p-2");
  });
});
