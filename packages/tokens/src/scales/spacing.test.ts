import { describe, expect, it } from "vitest";
import { resolveSpacingScale, validateSpacingScale } from "./spacing";
import type { SpacingScaleConfig } from "../types";

const validScale: SpacingScaleConfig = {
  base: 4,
  ratio: Math.SQRT2,
  steps: 10,
  unit: "px",
  rounding: "whole",
};

describe("validateSpacingScale", () => {
  it("accepts a valid numeric spacing scale", () => {
    expect(() => validateSpacingScale(validScale)).not.toThrow();
  });

  it.each([
    ["base", { base: 0 }],
    ["ratio", { ratio: 0 }],
    ["non-finite base", { base: Number.NaN }],
    ["non-finite ratio", { ratio: Number.POSITIVE_INFINITY }],
  ])("rejects invalid %s", (_name, override) => {
    expect(() =>
      validateSpacingScale({ ...validScale, ...override } as SpacingScaleConfig),
    ).toThrow();
  });

  it.each([0, 1.5, 11, 10.5])("rejects an invalid step count: %s", (steps) => {
    expect(() => validateSpacingScale({ ...validScale, steps })).toThrow(
      "Spacing scale steps must be an integer from 1 to 10.",
    );
  });

  it("rejects unsupported units and rounding modes", () => {
    expect(() =>
      validateSpacingScale({ ...validScale, unit: "em" as SpacingScaleConfig["unit"] }),
    ).toThrow("Spacing scale unit");
    expect(() =>
      validateSpacingScale({
        ...validScale,
        rounding: "decimal" as SpacingScaleConfig["rounding"],
      }),
    ).toThrow("Spacing scale rounding");
  });

  it("validates override steps and values", () => {
    expect(() =>
      validateSpacingScale({
        ...validScale,
        overrides: { "10": "40px" } as SpacingScaleConfig["overrides"],
      }),
    ).toThrow('Spacing scale override "10"');
    expect(() =>
      validateSpacingScale({ ...validScale, overrides: { 2: " " } }),
    ).toThrow('Spacing scale override "2" must be a non-empty string.');
  });

  it("resolves the default scale into numbered CSS values", () => {
    expect(resolveSpacingScale(validScale)).toEqual({
      "0": "0px",
      "1": "4px",
      "2": "6px",
      "3": "8px",
      "4": "11px",
      "5": "16px",
      "6": "23px",
      "7": "32px",
      "8": "45px",
      "9": "64px",
    });
  });

  it.each([
    ["up", ["0px", "4px", "6px", "9px", "12px"]],
    ["down", ["0px", "4px", "5px", "8px", "11px"]],
  ] as const)("supports %s rounding", (rounding, expected) => {
    const scale = resolveSpacingScale({ ...validScale, steps: 5, rounding });
    expect(Object.values(scale)).toEqual(expected);
  });

  it("applies overrides after resolving the formula", () => {
    expect(
      resolveSpacingScale({
        ...validScale,
        overrides: { "3": "10px" },
      }),
    ).toMatchObject({ "3": "10px" });
  });
});
