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

    it("should render exactly one span wrapper around the icon", () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");

      expect(span).toBeInTheDocument();
      expect(container.querySelectorAll("span")).toHaveLength(1);
      expect(span?.querySelector("svg")).toBeInTheDocument();
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
      expect(span).toHaveClass("w-7", "h-7");
    });

    it.each([
      ["xs", "w-4", "h-4"],
      ["sm", "w-5", "h-5"],
      ["md", "w-6", "h-6"],
      ["lg", "w-7", "h-7"],
      ["xl", "w-8", "h-8"],
    ] satisfies [IconProps["size"], string, string][])(
      "should preserve %s size classes",
      (size, width, height) => {
        const { container } = render(<Icon icon={<TestIcon />} size={size} />);
        expect(container.querySelector("span")).toHaveClass(
          "flex", "items-center", "justify-center", width, height,
        );
      },
    );

    it("keeps semantic color scalar when size changes across breakpoints", () => {
      const { container } = render(
        <Icon icon={<TestIcon />} size={{ base: "xs", md: "xl" }} color="muted" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-4", "h-4", "md:w-8", "md:h-8", "text-fg-muted");
      expect(span).not.toHaveClass("w-6", "h-6", "md:text-fg-muted");
      expect(span).not.toHaveAttribute("color");
    });

    it.each([
      ["muted", ["text-fg-muted"]],
      ["teal", ["text-(color:--cr-text)"]],
      ["rose", ["text-(color:--cr-text)"]],
    ] as const)("should apply %s color classes", (color, classes) => {
      const { container } = render(<Icon icon={<TestIcon />} color={color} />);
      expect(container.querySelector("span")).toHaveClass(...classes);
    });
  });

  describe("Defaults", () => {
    it('should use "md" as default size', () => {
      const { container } = render(<Icon icon={<TestIcon />} />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-6", "h-6"); // md size
    });

    it("inherits the parent's color when color is omitted", () => {
      render(
        <div style={{ color: "rgb(12, 34, 56)" }}>
          <Icon icon={<TestIcon />} data-testid="inherited-icon" />
        </div>,
      );
      const span = screen.getByTestId("inherited-icon");
      expect(span.className).not.toMatch(/(?:^|\s)(?:\S+:)?text-/);
      expect(getComputedStyle(span).color).toBe("rgb(12, 34, 56)");
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
      expect(span).toHaveClass("w-5", "h-5", "hover:opacity-75");
    });

    it("should apply layout props to its existing wrapper", () => {
      const { container } = render(<Icon icon={<TestIcon />} p={2} m={3} />);
      const span = container.querySelector("span");

      expect(span).toHaveClass("p-2", "m-3");
      expect(container.querySelectorAll("span")).toHaveLength(1);
    });

    it("should resolve responsive layout props on its existing wrapper", () => {
      const { container } = render(
        <Icon icon={<TestIcon />} p={{ base: 1, md: 4 }} />,
      );
      const span = container.querySelector("span");

      expect(span).toHaveClass("p-1", "md:p-4");
      expect(container.querySelectorAll("span")).toHaveLength(1);
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
    it("should combine size and semantic color", () => {
      const { container } = render(
        <Icon icon={<TestIcon />} size="lg" color="teal" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-7", "h-7", "text-(color:--cr-text)");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });

    it("should combine accessibility attributes with styling", () => {
      render(
        <Icon
          icon={<TestIcon />}
          aria-hidden={false}
          aria-label="Loading spinner"
          color="teal"
          size="md"
          className="animate-spin"
        />,
      );
      const img = screen.getByRole("img", { name: "Loading spinner" });
      expect(img).toHaveClass("animate-spin", "text-(color:--cr-text)", "w-6", "h-6");
    });

    it("should apply only supplied responsive size variants", () => {
      const { container } = render(<Icon icon={<TestIcon />} size={{ base: "sm", md: "lg" }} />);
      const span = container.querySelector("span");
      expect(span).toHaveClass("w-5", "h-5", "md:w-7", "md:h-7");
      expect(span).not.toHaveClass("w-6", "h-6");
    });
  });

  describe("Display name", () => {
    it("should have correct display name for debugging", () => {
      expect(Icon.displayName).toBe("Icon");
    });
  });
});
