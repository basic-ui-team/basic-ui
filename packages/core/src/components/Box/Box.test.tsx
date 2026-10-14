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
      expect(container.firstChild).not.toHaveClass("p-0", "m-0", "block", "static");
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
        <Box p={2} m={3}>
          Test
        </Box>,
      );
      expect(container.firstChild).toHaveClass("p-2");
      expect(container.firstChild).toHaveClass("m-3");
    });

    it("emits static responsive display and layout classes", () => {
      const { container } = renderWithProviders(
        <Box display={{ base: "inline", md: "block" }} p={{ base: 2, md: 4 }}>
          Test
        </Box>,
      );

      expect(container.firstChild).toHaveClass("inline");
      expect(container.firstChild).toHaveClass("md:block");
      expect(container.firstChild).toHaveClass("p-2");
      expect(container.firstChild).toHaveClass("md:p-4");
      expect(container.firstChild).not.toHaveAttribute("display");
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
