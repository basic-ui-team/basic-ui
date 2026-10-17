import React from "react";
import { describe, it, expect } from "vitest";
import { CardTitle } from "./Title";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Title", () => {
  it.each([
    ["h1", "text-3xl"],
    ["h2", "text-2xl"],
    ["h3", "text-xl"],
    ["h4", "text-lg"],
    ["h5", "text-md"],
    ["h6", "text-sm"],
  ] as const)("uses a fixed %s visual size without changing heading semantics", (size, utility) => {
    const { container } = renderWithProviders(<CardTitle size={size}>Title</CardTitle>);
    const title = container.querySelector("h3")!;
    expect(title).toHaveClass(utility);
    expect(title.className).not.toMatch(/(?:^|\s)(?:md|lg):text-/);
  });

  it("applies independent responsive size and alignment", () => {
    const { container } = renderWithProviders(
      <CardTitle size={{ base: "h6", lg: "h2" }} align={{ base: "center", md: "left" }}>
        Title
      </CardTitle>,
    );
    expect(container.firstElementChild).toHaveClass("text-sm", "lg:text-2xl", "text-center", "md:text-left");
    expect(container.firstElementChild).not.toHaveClass("text-2xl", "lg:font-sans");
  });

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
