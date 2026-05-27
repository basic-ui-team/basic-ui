import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Box } from "./Box";
import { axe } from "jest-axe";

describe("Box", () => {
  describe("rendering", () => {
    it("renders children and applies className", () => {
      const { container } = renderWithProviders(<Box className="custom-class">Hello</Box>);
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("defaults to a div element", () => {
      const { container } = renderWithProviders(<Box>Hi</Box>);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("renders as allowed element via as prop", () => {
      const { container } = renderWithProviders(<Box as="section">Section</Box>);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Box ref={ref}>Ref</Box>);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });
  });

  describe("variants", () => {
    it("applies display classes", () => {
      const { container } = renderWithProviders(<Box display="inline">Test</Box>);
      expect(container.firstChild).toHaveClass("inline");

      const { container: c2 } = renderWithProviders(<Box display="inline-block">Test</Box>);
      expect(c2.firstChild).toHaveClass("inline-block");

      const { container: c3 } = renderWithProviders(<Box display="none">Test</Box>);
      expect(c3.firstChild).toHaveClass("hidden");
    });

    it("applies padding and margin tokens", () => {
      const { container } = renderWithProviders(
        <Box p="sm" m="md">
          Test
        </Box>,
      );
      expect(container.firstChild).toHaveClass("p-sm");
      expect(container.firstChild).toHaveClass("m-md");
    });

    it("resolves responsive objects to base when no breakpoint matches", () => {
      const { container } = renderWithProviders(
        <Box display={{ base: "inline", md: "block" }} p={{ base: "sm", md: "lg" }}>
          Test
        </Box>,
      );
      expect(container.firstChild).toHaveClass("inline");
      expect(container.firstChild).toHaveClass("p-sm");
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = renderWithProviders(
        <Box>
          <div>child</div>
        </Box>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
