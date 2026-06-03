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

  it("applies all objectFit variants", () => {
    const variants = ["cover", "contain", "fill", "none", "scale-down"] as const;
    variants.forEach((fit) => {
      const { container } = renderWithProviders(<Image src="/i" alt="a" objectFit={fit} />);
      const img = container.querySelector("img");
      expect(img).toHaveClass(`object-${fit}`);
    });
  });

  it("accepts loading and decoding props", () => {
    const { container } = renderWithProviders(
      <Image src="/x" alt="x" loading="eager" decoding="sync" />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("decoding", "sync");
  });

  it("applies aspectRatio classes", () => {
    const { container } = renderWithProviders(<Image src="/i" alt="a" aspectRatio="video" />);
    const img = container.querySelector("img");
    expect(img).toHaveClass("aspect-video");
  });

  it("applies all aspectRatio variants", () => {
    const ratios = ["square", "video", "landscape", "portrait"] as const;
    ratios.forEach((ratio) => {
      const { container } = renderWithProviders(<Image src="/i" alt="a" aspectRatio={ratio} />);
      const img = container.querySelector("img");
      if (ratio === "landscape") {
        expect(img).toHaveClass("aspect-[4/3]");
      } else if (ratio === "portrait") {
        expect(img).toHaveClass("aspect-[3/4]");
      } else {
        expect(img).toHaveClass(`aspect-${ratio}`);
      }
    });
  });

  it("applies rounded classes", () => {
    const { container } = renderWithProviders(<Image src="/i" alt="a" rounded="full" />);
    const img = container.querySelector("img");
    expect(img).toHaveClass("rounded-full");
  });

  it("applies all rounded variants", () => {
    const roundeds = ["none", "sm", "md", "lg", "xl", "full"] as const;
    roundeds.forEach((rounded) => {
      const { container } = renderWithProviders(<Image src="/i" alt="a" rounded={rounded} />);
      const img = container.querySelector("img");
      if (rounded === "none") {
        expect(img).toHaveClass("rounded-none");
      } else {
        expect(img).toHaveClass(`rounded-${rounded}`);
      }
    });
  });

  it("combines aspectRatio with objectFit", () => {
    const { container } = renderWithProviders(
      <Image src="/i" alt="a" aspectRatio="square" objectFit="cover" />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveClass("aspect-square");
    expect(img).toHaveClass("object-cover");
  });

  it("applies custom className alongside variants", () => {
    const { container } = renderWithProviders(
      <Image src="/i" alt="a" objectFit="contain" className="custom-class" />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveClass("object-contain");
    expect(img).toHaveClass("custom-class");
  });

  it("picture element applies aspectRatio to wrapper", () => {
    const sources = [{ srcSet: "/small.jpg", media: "(max-width:600px)" }];
    const { container } = renderWithProviders(
      <Image as="picture" src="/fallback.jpg" alt="test" sources={sources} aspectRatio="video" />,
    );
    const picture = container.querySelector("picture");
    expect(picture).toHaveClass("aspect-video");
  });

  it("picture element applies rounded to wrapper", () => {
    const sources = [{ srcSet: "/small.jpg", media: "(max-width:600px)" }];
    const { container } = renderWithProviders(
      <Image as="picture" src="/fallback.jpg" alt="test" sources={sources} rounded="lg" />,
    );
    const picture = container.querySelector("picture");
    expect(picture).toHaveClass("rounded-lg");
  });

  it("picture element applies objectFit to inner img", () => {
    const sources = [{ srcSet: "/small.jpg", media: "(max-width:600px)" }];
    const { container } = renderWithProviders(
      <Image as="picture" src="/fallback.jpg" alt="test" sources={sources} objectFit="contain" />,
    );
    const img = container.querySelector("picture img");
    expect(img).toHaveClass("object-contain");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    renderWithProviders(<Image ref={ref} src="/i" alt="a" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it("passes basic axe accessibility checks", async () => {
    const { container } = renderWithProviders(<Image src="/a" alt="a" />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });

  it("passes axe accessibility checks with picture element", async () => {
    const sources = [{ srcSet: "/small.jpg", media: "(max-width:600px)" }];
    const { container } = renderWithProviders(
      <Image as="picture" src="/fallback.jpg" alt="test" sources={sources} />,
    );
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
