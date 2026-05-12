/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Icon } from "./Icon";
import type { IconProps } from "./icon.types";

/**
 * Simple test icon component
 */
const TestIcon = () => (
  <svg data-testid="test-svg" width="24" height="24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

/**
 * Icon component tests
 */
describe("Icon", () => {
  describe("Rendering", () => {
    it("should render the provided icon", () => {
      render(<Icon icon={<TestIcon />} />);
      expect(screen.getByTestId("test-svg")).toBeInTheDocument();
    });

    it("should render a span wrapper", () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("should render string content as icon", () => {
      render(<Icon icon="★" />);
      expect(screen.getByText("★")).toBeInTheDocument();
    });

    it("should render icon component directly", () => {
      render(<Icon icon={<TestIcon />} />);
      expect(screen.getByTestId("test-svg")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should apply size variant classes", () => {
      const { container } = render(<Icon icon={<TestIcon />} size="lg" />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-2xl", "h-2xl");
    });

    it("should apply all size variants", () => {
      const sizes: IconProps["size"][] = ["xs", "sm", "md", "lg", "xl"];

      sizes.forEach((size) => {
        const { container } = render(<Icon icon={<TestIcon />} size={size} />);
        const span = container.querySelector("span");
        expect(span).toHaveClass("flex", "items-center", "justify-center");
      });
    });

    it("should apply semantic variant classes", () => {
      const variants = [
        "default",
        "muted",
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "info",
      ] as const;

      variants.forEach((variant) => {
        const { container } = render(<Icon icon={<TestIcon />} variant={variant} />);
        const span = container.querySelector("span");
        expect(span?.className).toBeTruthy();
      });
    });

    it("should apply color override classes", () => {
      const { container: containerLight } = render(<Icon icon={<TestIcon />} color="light" />);
      expect(containerLight.querySelector("span")).toHaveClass("text-light");

      const { container: containerDark } = render(<Icon icon={<TestIcon />} color="dark" />);
      expect(containerDark.querySelector("span")).toHaveClass("text-dark");
    });
  });

  describe("Defaults", () => {
    it('should use "md" as default size', () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-xl", "h-xl"); // md size
    });

    it('should use "default" as default variant', () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("text-primary"); // default variant color
    });

    it('should use "default" as default color', () => {
      const { container } = render(<Icon icon={<TestIcon />} variant="success" />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("text-success");
      expect(span).not.toHaveClass("text-light", "text-dark");
    });
  });

  describe("Accessibility", () => {
    it("should be aria-hidden by default", () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });

    it("should accept aria-hidden={false}", () => {
      const { container } = render(<Icon icon={<TestIcon />} aria-hidden={false} />);
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("aria-hidden", "false");
    });

    it("should accept aria-label", () => {
      render(<Icon icon={<TestIcon />} aria-hidden={false} aria-label="Success icon" />);
      const img = screen.getByRole("img", { name: "Success icon" });
      expect(img).toBeInTheDocument();
    });

    it('should have role="img" when aria-label is provided', () => {
      render(<Icon icon={<TestIcon />} aria-hidden={false} aria-label="Close" />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("role", "img");
    });

    it('should not have role="img" when aria-label is not provided', () => {
      const { container } = render(<Icon icon={<TestIcon />} aria-hidden={false} />);
      const span = container.querySelector("span");
      expect(span).not.toHaveAttribute("role");
    });
  });

  describe("Styling", () => {
    it("should always include flex classes", () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("flex", "items-center", "justify-center");
    });

    it("should merge custom className", () => {
      const { container } = render(<Icon icon={<TestIcon />} className="custom-class" />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("flex", "items-center", "justify-center", "custom-class");
    });

    it("should merge custom className without conflicting styles", () => {
      const { container } = render(
        <Icon icon={<TestIcon />} className="hover:opacity-75" size="sm" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-lg", "h-lg", "hover:opacity-75");
    });
  });

  describe("Props spreading", () => {
    it("should accept and apply custom HTML attributes", () => {
      const { container } = render(<Icon icon={<TestIcon />} data-custom="test" id="my-icon" />);
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("data-custom", "test");
      expect(span).toHaveAttribute("id", "my-icon");
    });

    it("should accept event handlers", () => {
      const handleClick = vi.fn();
      const { container } = render(<Icon icon={<TestIcon />} onClick={handleClick} />);
      const span = container.querySelector("span") as HTMLElement;
      span?.click();
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("should accept style prop", () => {
      const { container } = render(<Icon icon={<TestIcon />} style={{ opacity: 0.5 }} />);
      const span = container.querySelector("span") as HTMLElement;
      expect(span.style.opacity).toBe("0.5");
    });
  });

  describe("Ref forwarding", () => {
    it("should forward ref to span element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Icon icon={<TestIcon />} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("should allow accessing DOM element properties via ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Icon icon={<TestIcon />} ref={ref} className="test-class" />);
      expect(ref.current?.className).toContain("test-class");
    });

    it("should allow calling methods on ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Icon icon={<TestIcon />} ref={ref} />);
      const offsetWidth = ref.current?.offsetWidth;
      expect(typeof offsetWidth).toBe("number");
    });
  });

  describe("Combination scenarios", () => {
    it("should combine size, variant, and color (color overrides variant)", () => {
      const { container } = render(
        <Icon icon={<TestIcon />} size="lg" variant="success" color="dark" />,
      );
      const span = container.querySelector("span");
      // Note: color override (text-dark) replaces variant color
      expect(span).toHaveClass("w-2xl", "h-2xl", "text-dark");
      expect(span).not.toHaveClass("text-success");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });

    it("should combine accessibility attributes with styling", () => {
      render(
        <Icon
          icon={<TestIcon />}
          aria-hidden={false}
          aria-label="Loading spinner"
          variant="primary"
          size="md"
          className="animate-spin"
        />,
      );
      const img = screen.getByRole("img", { name: "Loading spinner" });
      expect(img).toHaveClass("animate-spin", "text-primary", "w-xl", "h-xl");
    });

    it("should work with responsive size as object", () => {
      const { container } = render(<Icon icon={<TestIcon />} size={{ base: "sm", md: "lg" }} />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("should work with responsive size as primitive", () => {
      const { container } = render(<Icon icon={<TestIcon />} size="md" />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });
  });

  describe("Display name", () => {
    it("should have correct display name for debugging", () => {
      expect(Icon.displayName).toBe("Icon");
    });
  });
});
