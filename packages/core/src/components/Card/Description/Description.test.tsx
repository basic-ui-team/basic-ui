import React from "react";
import { describe, it, expect } from "vitest";
import { CardDescription } from "./Description";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Description", () => {
  it("renders a p by default", () => {
    const { container } = renderWithProviders(<CardDescription>Description</CardDescription>);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("supports the as prop to change element", () => {
    const { container } = renderWithProviders(<CardDescription as="span">Inline</CardDescription>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("forwards ref to the element", () => {
    const ref = React.createRef<HTMLElement>();
    renderWithProviders(
      <CardDescription as="div" ref={ref as React.Ref<HTMLDivElement>}>
        Block
      </CardDescription>,
    );
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardDescription>Description</CardDescription>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
