import { describe, expect, it } from "vitest";
import * as tokens from "./index";

describe("@basic-ui/tokens public API", () => {
  it("exports only theme authoring values", () => {
    expect(Object.keys(tokens).sort()).toEqual([
      "BRAND_PALETTE_FAMILIES",
      "PALETTE_FAMILIES",
      "TAILWIND_PALETTE_FAMILIES",
      "createTheme",
      "darkTheme",
      "lightTheme",
      "mergeTheme",
    ]);
  });
});
