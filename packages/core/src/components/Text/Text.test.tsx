import { describe, expect, it } from "vitest";
import { textVariants } from "./text.variants";
import { Text } from "./Text";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";

  describe("variants", () => {
    it.each([
      ["size", "xs"],
      ["size", "sm"],
      ["size", "md"],
      ["size", "lg"],
      ["size", "xl"],
      ["size", "2xl"],
      ["size", "3xl"],
      ["weight", "normal"],
      ["weight", "medium"],
      ["weight", "semibold"],
      ["weight", "bold"],
      ["color", "default"],
      ["color", "muted"],
      ["align", "left"],
      ["align", "center"],
      ["align", "right"],
      ["truncate", true],
      ["truncate", false],
      ["wrap", "nowrap"],
      ["wrap", "wrap"],
      ["wrap", "balance"],
      ["wrap", "pretty"],
    ])("should apply the correct classes for %s variant with value %s", (variant, value) => {
      const props = { [variant]: value, as: "p" as const };
      const { container } = renderWithProviders(<Text {...props}>Test</Text>);
      const el = container.querySelector("p");
      expect(el).toBeInTheDocument();
      if (variant === "truncate" && value === true) {
        expect(el).toHaveClass("overflow-hidden", "text-ellipsis", "whitespace-nowrap");
      } else {
        expect(el).toHaveClass(textVariants({ [variant]: value }));
      }
    });
  });

  describe("palette colors", () => {
    it("should apply palette recipe utilities and variables", () => {
      const { container } = renderWithProviders(<Text color="teal">Test</Text>);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("text-(color:--cr-text)");
      expect(el.getAttribute("style")).toContain("--cr-text: var(--color-teal-700)");
      expect(el.getAttribute("style")).toContain("--cr-text-dark: var(--color-teal-300)");
    });

    it("should not apply structural color classes when a palette color is provided", () => {
      const { container } = renderWithProviders(<Text color="teal">Test</Text>);
      expect(container.firstChild).not.toHaveClass(textVariants({ color: "default" }));
    });
  });

  describe("element type", () => {
    it("should render a span when as='span'", () => {
      const { container } = renderWithProviders(<Text as="span">Test</Text>);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("should render a p when as='p'", () => {
      const { container } = renderWithProviders(<Text as="p">Test</Text>);
      expect(container.querySelector("p")).toBeInTheDocument();
    });

    it("should render a div when as='div'", () => {
      const { container } = renderWithProviders(<Text as="div">Test</Text>);
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should render text content that is accessible to screen readers", () => {
      const { getByText } = renderWithProviders(<Text>Accessible Text</Text>);
      expect(getByText("Accessible Text")).toBeInTheDocument();
    });

    it("should auto-add title and aria-label when truncate is true and no label is provided", () => {
      const { getByText } = renderWithProviders(<Text truncate>Truncated Text</Text>);
      const el = getByText("Truncated Text");
      expect(el).toHaveAttribute("title", "Truncated Text");
      expect(el).toHaveAttribute("aria-label", "Truncated Text");
    });

    it("should apply appropriate aria attributes when truncate is true", () => {
      const { getByText } = renderWithProviders(
        <Text truncate title="Full text">
          Truncated Text
        </Text>,
      );
      const truncatedElement = getByText("Truncated Text");
      expect(truncatedElement).toHaveClass("overflow-hidden", "text-ellipsis", "whitespace-nowrap");
      expect(truncatedElement).toHaveAttribute("title", "Full text");
    });

    describe("responsive CSS", () => {
      it("renders independent responsive axes without viewport state", () => {
        const markup = renderToString(
          <Text
            size={{ base: "xs", lg: "2xl" }}
            align={{ base: "center", md: "right" }}
            color="sky"
            weight="semibold"
          >
            Text
          </Text>,
        );
        expect(markup).toContain("text-xs");
        expect(markup).toContain("lg:text-2xl");
        expect(markup).toContain("md:text-right");
        expect(markup).toContain("text-(color:--cr-text)");
        expect(markup).not.toMatch(/(?:md|lg):(?:font-|text-fg-)/);
      });

      it("restores flow after truncation and keeps full-text attributes stable", () => {
        const { container } = renderWithProviders(
          <Text
            truncate={{ base: true, md: false }}
            wrap={{ base: "nowrap", sm: "pretty" }}
            overflowX={{ base: "auto", lg: "scroll" }}
          >
            Full text
          </Text>,
        );
        const text = container.firstElementChild!;
        expect(text).toHaveClass(
          "overflow-hidden", "text-ellipsis", "whitespace-nowrap",
          "md:overflow-x-auto", "md:overflow-y-visible",
          "md:text-clip", "md:whitespace-normal", "md:text-pretty",
          "lg:overflow-x-scroll",
        );
        expect(text).toHaveAttribute("title", "Full text");
        expect(text).toHaveAttribute("aria-label", "Full text");
      });

      it("adds stable full-text attributes when truncation begins at a later breakpoint", () => {
        const { container } = renderWithProviders(
          <Text truncate={{ base: false, md: true }}>Full text</Text>,
        );
        expect(container.firstElementChild).toHaveAttribute("title", "Full text");
        expect(container.firstElementChild).toHaveAttribute("aria-label", "Full text");
        expect(container.firstElementChild).toHaveClass("md:whitespace-nowrap");
      });

      it("preserves explicit accessibility attributes and consumer class overrides", () => {
        const { container } = renderWithProviders(
          <Text
            truncate={{ base: true, md: false }}
            title="Custom title"
            aria-label="Custom label"
            className="md:overflow-auto"
          >
            Text
          </Text>,
        );
        const text = container.firstElementChild!;
        expect(text).toHaveAttribute("title", "Custom title");
        expect(text).toHaveAttribute("aria-label", "Custom label");
        expect(text).toHaveClass("md:overflow-auto");
        expect(text).not.toHaveClass("md:overflow-visible");
      });

      it("retains inline span alignment behavior", () => {
        const { container } = renderWithProviders(
          <Text as="span" align={{ base: "center", md: "right" }}>Inline</Text>,
        );
        expect(container.firstElementChild).toHaveClass("text-left");
        expect(container.firstElementChild).not.toHaveClass("text-center", "md:text-right");
      });
    });

    it("should pass an axe accessibility audit", async () => {
      const { container } = renderWithProviders(
        <Text size="lg" weight="bold" color="primary" align="center" truncate wrap="balance">
          Accessibility Test Text
        </Text>,
      );
      const result = await axe(container);
      expect(result).toHaveNoViolations();
  });
});
