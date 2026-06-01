import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { Spinner } from "./Spinner";
import { axe } from "jest-axe";

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
    it.each<[string]>([["xs"], ["sm"], ["md"], ["lg"], ["xl"]])(
      "applies size variant '%s'",
      (size) => {
        const { container } = renderWithProviders(<Spinner size={size as any} />);
        const spinner = container.firstChild as HTMLElement;

        if (size === "xs") expect(spinner).toHaveClass("h-md", "w-md", "border-2");
        if (size === "sm") expect(spinner).toHaveClass("h-lg", "w-lg", "border-3");
        if (size === "md") expect(spinner).toHaveClass("h-xl", "w-xl", "border-4");
        if (size === "lg") expect(spinner).toHaveClass("h-2xl", "w-2xl", "border-5");
        if (size === "xl") expect(spinner).toHaveClass("h-3xl", "w-3xl", "border-6");
      },
    );

    it("defaults to md size", () => {
      const { container } = renderWithProviders(<Spinner />);
      expect(container.firstChild).toHaveClass("h-xl", "w-xl", "border-4");
    });
  });

  describe("color variants", () => {
    it.each<[string]>([
      ["default"],
      ["muted"],
      ["primary"],
      ["secondary"],
      ["success"],
      ["error"],
      ["warning"],
      ["info"],
    ])(
      "applies color variant '%s'",
      (color) => {
        const { container } = renderWithProviders(<Spinner color={color as any} />);
        const spinner = container.firstChild as HTMLElement;

        // Color classes are applied directionally (e.g., border-l-primary-500)
        if (color === "default") expect(spinner.className).toContain("border-border-base");
        if (color === "muted") expect(spinner.className).toContain("border-border-muted");
        if (color === "primary") expect(spinner.className).toContain("border-primary-500");
        if (color === "secondary") expect(spinner.className).toContain("border-secondary-500");
        if (color === "success") expect(spinner.className).toContain("border-success");
        if (color === "error") expect(spinner.className).toContain("border-error");
        if (color === "warning") expect(spinner.className).toContain("border-warning");
        if (color === "info") expect(spinner.className).toContain("border-info");
      },
    );

    it("defaults to default color", () => {
      const { container } = renderWithProviders(<Spinner />);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain("border-border-base");
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

  describe("spacing props", () => {
    it.each<[string]>([
      ["m"],
      ["mx"],
      ["my"],
      ["mb"],
      ["ml"],
      ["mr"],
      ["mt"],
    ] as const)("applies %s spacing prop", (prop) => {
      const props: Record<string, string> = { [prop]: "md" };
      const { container } = renderWithProviders(<Spinner {...props} />);
      // The Box component handles these, so we just verify it renders without error
      expect(container.firstChild).toBeInTheDocument();
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
      const { container } = renderWithProviders(<Spinner size="lg" color="primary" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass("h-2xl", "w-2xl", "border-5");
      expect(spinner.className).toContain("border-primary-500");
    });

    it("applies all props together", () => {
      const { container } = renderWithProviders(
        <Spinner
          size="sm"
          color="success"
          ariaLabel="Loading data"
          className="custom"
          m="lg"
        />,
      );
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass("h-lg", "w-lg", "border-3", "custom");
      expect(spinner.className).toContain("border-success");
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
