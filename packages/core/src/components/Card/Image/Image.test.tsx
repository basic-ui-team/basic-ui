import React from "react";
import { describe, it, expect } from "vitest";
import { CardImage } from "./Image";
import { CardContext } from "../Card";
import { renderWithProviders } from "../../../test-utils";
import { axe } from "jest-axe";

describe("Card.Image", () => {
  it("changes fit and ratio independently, including restoring auto ratio", () => {
    const { container } = renderWithProviders(
      <CardImage
        src="/img.png"
        alt="img"
        objectFit={{ base: "cover", lg: "contain" }}
        aspectRatio={{ base: "square", md: "auto" }}
        rounded="lg"
      />,
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveClass("object-cover", "lg:object-contain", "aspect-square", "md:aspect-auto", "rounded-lg");
    expect(img.className.split(/\s+/).filter((name) => name.startsWith("md:"))).toEqual(["md:aspect-auto"]);
    expect(img.className.split(/\s+/).filter((name) => name.startsWith("lg:"))).toEqual(["lg:object-contain"]);
    expect(img).not.toHaveClass("aspect-auto", "lg:inline-block", "lg:rounded-lg");
  });

  it("renders an img with provided src and alt and default object-fit", () => {
    const { container } = renderWithProviders(<CardImage src="/img.png" alt="img" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/img.png");
    expect(img).toHaveAttribute("alt", "img");
    expect(img).toHaveClass("object-cover");
  });

  it("applies different objectFit variants", () => {
    const { container } = renderWithProviders(<CardImage src="/i" alt="a" objectFit="contain" />);
    const img = container.querySelector("img");
    expect(img).toHaveClass("object-contain");
  });

  it("reflects disabled state from Card context", () => {
      const ctxValue: React.ContextType<typeof CardContext> = {
        variant: "default",
        disabled: true,
        selected: false,
        isLink: false,
      };

      const { container } = renderWithProviders(
        <CardContext.Provider value={ctxValue}>
        <CardImage src="/img.png" alt="i" />
      </CardContext.Provider>,
    );

    const img = container.querySelector("img");
    expect(img).toHaveClass("opacity-50");
  });

  it("forwards ref to the img element", () => {
    const ref = React.createRef<HTMLImageElement>();
    renderWithProviders(<CardImage ref={ref} src="/x" alt="x" />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("IMG");
  });

  it("passes a basic axe accessibility check", async () => {
    const { container } = renderWithProviders(<CardImage src="/a" alt="a" />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
