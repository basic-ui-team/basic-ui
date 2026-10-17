import { describe, expect, it } from "vitest";
import { getCardTextFlowClasses } from "./card-text-utils";

describe("Card text flow", () => {
  it("does not add truncation resets when truncation is never enabled", () => {
    expect(getCardTextFlowClasses({
      truncate: { base: false, md: false },
      wrap: { base: "wrap", md: "pretty" },
      overflowX: { base: "auto", lg: "scroll" },
    })).toEqual({
      hasTruncation: false,
      className: "text-wrap md:text-pretty overflow-x-auto lg:overflow-x-scroll",
    });
  });

  it("restores default overflow and the selected nowrap mode", () => {
    expect(getCardTextFlowClasses({
      truncate: { base: true, md: false },
      wrap: "nowrap",
    })).toEqual({
      hasTruncation: true,
      className: "overflow-hidden text-ellipsis whitespace-nowrap md:overflow-visible md:text-clip md:whitespace-nowrap md:text-nowrap",
    });
  });

  it("carries axis overrides while truncated and restores them in breakpoint order", () => {
    const result = getCardTextFlowClasses({
      truncate: { base: true, lg: false },
      wrap: { base: "nowrap", md: "wrap" },
      overflow: { base: "auto", xl: "hidden" },
      overflowX: { base: "scroll" },
      overflowY: { base: "auto", md: "visible" },
    });
    expect(result.className).toContain("lg:overflow-x-scroll lg:overflow-y-visible");
    expect(result.className).toContain("lg:text-clip lg:whitespace-normal lg:text-wrap");
    expect(result.className).toContain("xl:overflow-hidden");
    expect(result.className).not.toContain("xl:overflow-x-scroll");
  });

  it("restores visible overflow for unset after truncation", () => {
    const result = getCardTextFlowClasses({
      truncate: { base: true, md: false },
      wrap: "wrap",
      overflow: { base: "scroll", md: "unset" },
    });
    expect(result.className).toContain("md:overflow-visible");
    expect(result.className).not.toContain("overflow-unset");
  });
});
