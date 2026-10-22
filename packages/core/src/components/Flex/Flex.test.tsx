import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Flex } from "./Flex";
import { axe } from "jest-axe";

describe("Flex", () => {
  describe("rendering", () => {
    it("renders children and applies className", () => {
      const { container } = renderWithProviders(<Flex className="custom-class">Hello</Flex>);
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("defaults to a div element", () => {
      const { container } = renderWithProviders(<Flex>Hi</Flex>);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("renders as allowed element via as prop", () => {
      const { container } = renderWithProviders(<Flex as="nav">Nav</Flex>);
      expect(container.querySelector("nav")).toBeInTheDocument();
    });

    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Flex ref={ref}>Ref</Flex>);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });
  });

  describe("variants", () => {
    it("preserves explicit layout defaults without introducing gap or padding", () => {
      const { container } = renderWithProviders(<Flex>Test</Flex>);

      expect(container.firstChild).toHaveClass(
        "flex", "flex-row", "flex-nowrap", "justify-start", "items-stretch",
      );
      expect(container.firstChild).not.toHaveClass("gap-3", "p-0");
    });

    it("keeps independently responsive axes from injecting defaults into one another", () => {
      const { container } = renderWithProviders(
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "end", xl: "between" }}
          align={{ base: "start", md: "center" }}
          wrap={{ base: "nowrap", "2xl": "wrap" }}
          display={{ base: "inline-flex", lg: "flex" }}
        >
          Test
        </Flex>,
      );

      expect(container.firstChild).toHaveClass(
        "flex-col", "md:flex-row", "justify-end", "xl:justify-between",
        "items-start", "md:items-center", "flex-nowrap", "2xl:flex-wrap",
        "inline-flex", "lg:flex",
      );
      expect(container.firstChild).not.toHaveClass(
        "flex", "md:flex", "md:justify-start", "md:items-stretch", "lg:flex-row",
      );
    });

    it("allows consumer classes to override matching base and breakpoint utilities", () => {
      const { container } = renderWithProviders(
        <Flex
          direction={{ base: "column", md: "row" }}
          className="flex-row md:flex-col"
        >
          Test
        </Flex>,
      );

      expect(container.firstChild).toHaveClass("flex-row", "md:flex-col");
      expect(container.firstChild).not.toHaveClass("flex-col", "md:flex-row");
    });

    it("applies direction classes", () => {
      const { container } = renderWithProviders(<Flex direction="column">Test</Flex>);
      expect(container.firstChild).toHaveClass("flex-col");
    });

    it("applies wrap classes", () => {
      const { container } = renderWithProviders(<Flex wrap="wrap">Test</Flex>);
      expect(container.firstChild).toHaveClass("flex-wrap");
    });

    it("applies justify classes", () => {
      const { container } = renderWithProviders(<Flex justify="center">Test</Flex>);
      expect(container.firstChild).toHaveClass("justify-center");
    });

    it("applies align classes", () => {
      const { container } = renderWithProviders(<Flex align="start">Test</Flex>);
      expect(container.firstChild).toHaveClass("items-start");
    });

    it("applies display classes", () => {
      const { container } = renderWithProviders(<Flex display="inline-flex">Test</Flex>);
      expect(container.firstChild).toHaveClass("inline-flex");
    });

    it("emits static responsive variant classes", () => {
      const { container } = renderWithProviders(
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "start", md: "between" }}
          display={{ base: "flex", md: "inline-flex" }}
        >
          Test
        </Flex>,
      );

      expect(container.firstChild).toHaveClass("flex-col");
      expect(container.firstChild).toHaveClass("md:flex-row");
      expect(container.firstChild).toHaveClass("justify-start");
      expect(container.firstChild).toHaveClass("md:justify-between");
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("md:inline-flex");
      expect(container.firstChild).not.toHaveAttribute("direction");
      expect(container.firstChild).not.toHaveAttribute("justify");
      expect(container.firstChild).not.toHaveAttribute("display");
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = renderWithProviders(
        <Flex>
          <div>child</div>
        </Flex>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
