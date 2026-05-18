import { describe, expect, it } from "vitest";
import { textVariants } from "./text.variants";
import { Text } from "./Text";
import { renderWithProviders } from "@core/test-utils/renderWithProviders";
import { axe } from "jest-axe";

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
      ["color", "primary"],
      ["color", "secondary"],
      ["color", "error"],
      ["color", "success"],
      ["color", "warning"],
      ["color", "info"],
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
      expect(container.querySelector("p")).toHaveClass(textVariants({ [variant]: value }));
    });
  });

  describe("custom colors", () => {
    it("should apply custom color classes", () => {
      const { container } = renderWithProviders(<Text color="text-red-500">Test</Text>);
      expect(container.firstChild).toHaveClass("text-red-500");
    });
    it("should apply custom color classes with arbitrary values", () => {
      const { container } = renderWithProviders(<Text color="text-[var(--my-color)]">Test</Text>);
      expect(container.firstChild).toHaveClass("text-[var(--my-color)]");
    });

    it("should not apply built-in color classes when a custom color is provided", () => {
      const { container } = renderWithProviders(<Text color="text-red-500">Test</Text>);
      expect(container.firstChild).not.toHaveClass(textVariants({ color: "primary" }));
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
      expect(truncatedElement).toHaveClass(textVariants({ truncate: true }));
      expect(truncatedElement).toHaveAttribute("title", "Full text");
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
