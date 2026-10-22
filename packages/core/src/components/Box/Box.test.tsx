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
      expect((container.firstChild as HTMLElement).className).toBe("");
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

    it("forwards native props and refs to polymorphic elements", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      renderWithProviders(
        <Box
          as="a"
          ref={ref}
          href="/docs"
          aria-label="Read the documentation"
          data-testid="documentation-link"
          title="Documentation"
        >
          Documentation
        </Box>,
      );

      const link = screen.getByTestId("documentation-link");
      expect(link).toHaveAttribute("href", "/docs");
      expect(link).toHaveAttribute("aria-label", "Read the documentation");
      expect(link).toHaveAttribute("title", "Documentation");
      expect(ref.current).toBe(link);
    });
  });

  describe("styling contract", () => {
    it("passes authored utilities through verbatim", () => {
      const { container } = renderWithProviders(
        <Box className="p-4 md:p-0 relative">Test</Box>,
      );
      expect(container.firstChild).toHaveClass("p-4", "md:p-0", "relative");
    });

    it("applies inline styles", () => {
      renderWithProviders(<Box data-testid="styled-box" style={{ color: "red" }} />);
      expect(screen.getByTestId("styled-box").style.color).toBe("red");
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
