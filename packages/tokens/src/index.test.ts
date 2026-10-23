import { describe, expect, it } from "vitest";
import * as tokens from "./index";
import {
  BRAND_PALETTE_FAMILIES,
  PALETTE_FAMILIES,
  TAILWIND_PALETTE_FAMILIES,
} from "./palette";

describe("@basic-ui/tokens public API", () => {
  it("exports only the palette registry", () => {
    expect(Object.keys(tokens).sort()).toEqual([
      "BRAND_PALETTE_FAMILIES",
      "PALETTE_FAMILIES",
      "TAILWIND_PALETTE_FAMILIES",
    ]);
  });

  it("registers brand families with authored ramps", () => {
    expect(BRAND_PALETTE_FAMILIES).toEqual(["primary", "secondary", "accent"]);
  });

  it("composes the palette from Tailwind and brand families", () => {
    expect(PALETTE_FAMILIES).toEqual([
      ...TAILWIND_PALETTE_FAMILIES,
      ...BRAND_PALETTE_FAMILIES,
    ]);
  });
});
