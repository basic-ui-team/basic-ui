import React from "react";
import { describe, it, expect } from "vitest";
import { CardTitle } from "./Title";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Title", () => {
  it("renders an h3 by default", () => {
    const { container } = renderWithProviders(<CardTitle>Title</CardTitle>);
    expect(container.querySelector("h3")).toBeInTheDocument();
  });

  it("supports the as prop to change heading level", () => {
    const { container } = renderWithProviders(<CardTitle as="h2">Title</CardTitle>);
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("forwards ref to the heading element", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    renderWithProviders(
      <CardTitle as="h4" ref={ref}>
        Title
      </CardTitle>,
    );
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("H4");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardTitle>Accessible</CardTitle>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
