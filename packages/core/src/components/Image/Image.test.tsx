import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { Image } from "./Image";
import { axe } from "jest-axe";

describe("Image", () => {
  it("renders an img with provided src and alt", () => {
    const { container } = renderWithProviders(<Image src="/img.png" alt="img" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/img.png");
    expect(img).toHaveAttribute("alt", "img");
  });

  it("renders picture with sources when provided", () => {
    const sources = [{ srcSet: "/small.jpg 1x, /small@2x.jpg 2x", media: "(max-width:600px)" }];
    const { container } = renderWithProviders(
      <Image as="picture" src="/fallback.jpg" alt="fallback" sources={sources} />,
    );

    expect(container.querySelector("picture")).toBeInTheDocument();
    expect(container.querySelectorAll("source")).toHaveLength(sources.length);
    const source = container.querySelector("source");
    expect(source).toHaveAttribute("srcset", sources[0].srcSet);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/fallback.jpg");
  });

  it("applies objectFit classes", () => {
    const { container } = renderWithProviders(<Image src="/i" alt="a" objectFit="contain" />);
    const img = container.querySelector("img");
    expect(img).toHaveClass("object-contain");
  });

  it("accepts loading and decoding props", () => {
    const { container } = renderWithProviders(
      <Image src="/x" alt="x" loading="eager" decoding="sync" />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("decoding", "sync");
  });

  it("passes basic axe accessibility checks", async () => {
    const { container } = renderWithProviders(<Image src="/a" alt="a" />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
