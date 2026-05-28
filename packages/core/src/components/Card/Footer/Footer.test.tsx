import React from "react";
import { describe, it, expect } from "vitest";
import { CardFooter } from "./Footer";
import { CardContext } from "../Card";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Footer", () => {
  it("renders a footer element with default padding", () => {
    const { container } = renderWithProviders(<CardFooter>F</CardFooter>);
    const el = container.querySelector("footer");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("p-md");
  });

  it("supports sticky footers", () => {
    const { container } = renderWithProviders(<CardFooter sticky>Sticky</CardFooter>);
    const el = container.querySelector("footer");
    expect(el).toHaveClass("sticky");
    expect(el).toHaveClass("bottom-0");
  });

  it("reflects disabled state from Card context", () => {
    const { container } = renderWithProviders(
      <CardContext.Provider value={{ variant: "default", disabled: true, selected: false, isLink: false } as any}>
        <CardFooter>F</CardFooter>
      </CardContext.Provider>,
    );

    const el = container.querySelector("footer");
    expect(el).toHaveClass("opacity-50");
  });

  it("forwards ref to the footer element", () => {
    const ref = React.createRef<HTMLElement>();
    renderWithProviders(<CardFooter ref={ref}>Ref</CardFooter>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("FOOTER");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardFooter>Accessible</CardFooter>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
