import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { Spinner } from "./Spinner";
import { axe } from "jest-axe";
import type { SpinnerColor, SpinnerSizes } from "./spinner.types";

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders a spinner element by default", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("renders when visible is true", () => {
      const { container } = renderWithProviders(<Spinner visible={true} />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("does not render when visible is false", () => {
      const { container } = renderWithProviders(<Spinner visible={false} />);
      expect(container.querySelector("div")).not.toBeInTheDocument();
    });

    it("applies correct animation classes", () => {
      const { container } = renderWithProviders(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass("animate-spin");
      expect(spinner).toHaveClass("rounded-full");
    });

    it("applies custom className", () => {
      const { container } = renderWithProviders(<Spinner className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies inline styles", () => {
      const { container } = renderWithProviders(<Spinner style={{ color: "red" }} />);
      const element = container.firstChild as HTMLElement;
      expect(element.style.color).toBe("red");
    });
  });

  describe("accessibility", () => {
    it("has role status", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.firstChild).toHaveAttribute("role", "status");
    });

    it("has aria-busy true", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.firstChild).toHaveAttribute("aria-busy", "true");
    });

    it("has default aria-label", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.firstChild).toHaveAttribute("aria-label", "Loading");
    });

    it("uses custom aria-label when provided", () => {
      const { container } = renderWithProviders(<Spinner ariaLabel="Processing data" />);
      expect(container.firstChild).toHaveAttribute("aria-label", "Processing data");
    });

    it("passes axe accessibility checks", async () => {
      const { container } = renderWithProviders(<Spinner />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("size variants", () => {
    it.each([
      ["xs", "h-4", "w-4", "border-1"],
      ["sm", "h-5", "w-5", "border-2"],
      ["md", "h-6", "w-6", "border-3"],
      ["lg", "h-7", "w-7", "border-4"],
      ["xl", "h-8", "w-8", "border-5"],
    ] satisfies [SpinnerSizes, string, string, string][])(
      "applies size variant '%s'",
      (size, height, width, borderWidth) => {
        const { container } = renderWithProviders(<Spinner size={size} />);
        const spinner = container.firstChild as HTMLElement;

        expect(spinner).toHaveClass(height, width, borderWidth);
      },
    );

    it("defaults to md size", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.firstChild).toHaveClass("h-6", "w-6", "border-3");
    });

    it("applies responsive sizes without changing the semantic color", () => {
      const { container } = renderWithProviders(
        <Spinner size={{ base: "xs", md: "xl" }} color="default" />,
      );
      const spinner = container.firstChild as HTMLElement;

      expect(spinner).toHaveClass(
        "h-4", "w-4", "border-1", "md:h-8", "md:w-8", "md:border-5",
        "border-border", "border-t-transparent",
      );
      expect(spinner).not.toHaveClass("h-6", "w-6", "md:border-border");
    });
  });

  describe("color variants", () => {
    it.each([
      ["default", "border-border"],
      ["muted", "border-muted"],
    ] satisfies [SpinnerColor, string][])(
      "applies color variant '%s'",
      (color, borderColor) => {
        const { container } = renderWithProviders(<Spinner color={color} />);
        const spinner = container.firstChild as HTMLElement;

        expect(spinner).toHaveClass(borderColor, "border-t-transparent");
      },
    );

    it("defaults to default color", () => {
      const { container } = renderWithProviders(<Spinner />);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain("border-border");
    });

    it("keeps colors scalar across responsive sizes", () => {
      const { container } = renderWithProviders(
        <Spinner size={{ base: "xs", md: "xl" }} color="muted" />,
      );
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("border-muted");
      expect(el.className).not.toMatch(/md:border-muted/);
    });
  });

  describe("polymorphic element", () => {
    it("renders as div by default", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("renders as span when as prop is provided", () => {
      const { container } = renderWithProviders(<Spinner as="span" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("forwards ref to polymorphic element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      renderWithProviders(<Spinner as="span" ref={ref} />);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("SPAN");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Spinner ref={ref} />);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.classList.contains("animate-spin")).toBe(true);
    });

    it("allows accessing spinner properties via ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Spinner ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current?.classList.contains("animate-spin")).toBe(true);
    });
  });

  describe("combined variants", () => {
    it("applies size and color together", () => {
      const { container } = renderWithProviders(<Spinner size="lg" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass("h-7", "w-7", "border-4", "border-border");
    });

    it("applies all props together", () => {
      const { container } = renderWithProviders(
        <Spinner
          size="sm"
          color="default"
          ariaLabel="Loading data"
          className="custom"
        />,
      );
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass(
        "h-5", "w-5", "border-2", "custom", "border-border",
      );
      expect(spinner).toHaveAttribute("aria-label", "Loading data");
      expect(spinner).toHaveAttribute("role", "status");
    });
  });

  describe("edge cases", () => {
    it("handles undefined optional props", () => {
      const { container } = renderWithProviders(
        <Spinner size={undefined} color={undefined} ariaLabel={undefined} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("maintains spinner state when visible prop changes", () => {
      const { rerender, container } = renderWithProviders(<Spinner visible={true} />);
      expect(container.querySelector("div")).toBeInTheDocument();

      rerender(<Spinner visible={false} />);
      expect(container.querySelector("div")).not.toBeInTheDocument();

      rerender(<Spinner visible={true} />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });
});
