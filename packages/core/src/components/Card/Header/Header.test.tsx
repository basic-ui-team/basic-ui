import React from "react";
import { describe, it, expect } from "vitest";
import { CardHeader } from "./Header";
import { CardContext } from "../Card";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Header", () => {
  it("renders a header element with default spacing", () => {
    const { container } = renderWithProviders(<CardHeader>Head</CardHeader>);
    const el = container.querySelector("header");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("p-md");
  });

  it("applies compact variant classes", () => {
    const { container } = renderWithProviders(<CardHeader variant="compact">Hi</CardHeader>);
    const el = container.querySelector("header");
    expect(el).toHaveClass("p-sm");
  });

  it("reflects disabled state from Card context", () => {
    const { container } = renderWithProviders(
      <CardContext.Provider value={{ variant: "default", disabled: true, selected: false, isLink: false } as any}>
        <CardHeader>Head</CardHeader>
      </CardContext.Provider>,
    );

    const el = container.querySelector("header");
    expect(el).toHaveClass("opacity-50");
  });

  it("forwards ref to the header element", () => {
    const ref = React.createRef<HTMLElement>();
    renderWithProviders(<CardHeader ref={ref}>Ref</CardHeader>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("HEADER");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardHeader>Accessible</CardHeader>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
