import { getTruncateAccessibilityProps } from "./accessibility";

describe("getTruncateAccessibilityProps", () => {
  it("returns title and aria-label when truncate is true and children is a string", () => {
    const props = getTruncateAccessibilityProps("Hello World", true, {});
    expect(props).toEqual({ title: "Hello World", "aria-label": "Hello World" });
  });

    it("does not return title and aria-label when truncate is false", () => {
    const props = getTruncateAccessibilityProps("Hello World", false, {});
    expect(props).toEqual({});
  });

    it("does not return title and aria-label when they are already provided in restProps", () => {
    const props = getTruncateAccessibilityProps("Hello World", true, { title: "Custom Title" });
    expect(props).toEqual({});
  });
});