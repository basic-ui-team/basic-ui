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

    it("applies inline flex when inline={true}", () => {
      const { container } = renderWithProviders(<Flex inline={true}>Test</Flex>);
      expect(container.firstChild).toHaveClass("inline-flex");
    });

    it("applies gap and padding tokens", () => {
      const { container } = renderWithProviders(<Flex gap="md" padding="sm">Test</Flex>);
      expect(container.firstChild).toHaveClass("gap-md");
      expect(container.firstChild).toHaveClass("p-sm");
    });
  });

  describe("custom values", () => {
    it("accepts custom gap class strings", () => {
      const { container } = renderWithProviders(<Flex gap="gap-8">X</Flex>);
      expect(container.firstChild).toHaveClass("gap-8");
    });

    it("accepts custom padding strings", () => {
      const { container } = renderWithProviders(<Flex padding="p-4">X</Flex>);
      expect(container.firstChild).toHaveClass("p-4");
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
