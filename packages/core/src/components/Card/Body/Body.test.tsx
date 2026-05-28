import React from "react";
import { describe, it, expect } from "vitest";
import { CardBody } from "./Body";
import { CardContext } from "../Card";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Body", () => {
  it("renders a div with default padding", () => {
    const { container } = renderWithProviders(<CardBody>Content</CardBody>);
    const el = container.querySelector("div");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("p-md");
  });

  it("applies compact variant classes", () => {
    const { container } = renderWithProviders(<CardBody variant="compact">C</CardBody>);
    const el = container.querySelector("div");
    expect(el).toHaveClass("p-sm");
  });

  it("receives disabled state from Card context", () => {
    const { container } = renderWithProviders(
      <CardContext.Provider value={{ variant: "default", disabled: true, selected: false, isLink: false } as any}>
        <CardBody>Body</CardBody>
      </CardContext.Provider>,
    );

    const el = container.querySelector("div");
    expect(el).toHaveClass("opacity-50");
  });

  it("forwards ref to the div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithProviders(<CardBody ref={ref}>Ref</CardBody>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardBody>Accessible</CardBody>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
