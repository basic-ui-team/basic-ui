import { describe, expect, it } from "vitest";
import * as tokens from "./index";

describe("@basic-ui/tokens public API", () => {
  it("exports only theme authoring values", () => {
    expect(Object.keys(tokens).sort()).toEqual([
      "DEFAULT_SPACING_SCALE",
      "createTheme",
      "darkTheme",
      "lightTheme",
      "mergeTheme",
    ]);
  });
});
