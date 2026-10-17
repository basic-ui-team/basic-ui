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

  describe("variants", () => {
    it("preserves concrete resets and matching consumer overrides", () => {
      const { container } = renderWithProviders(
        <Box
          p={{ base: 4, md: 0 }}
          hMax={{ base: "screen", md: "none" }}
          wMax={{ base: "full", md: "none" }}
          overflow={{ base: "hidden", md: "visible" }}
          className="md:p-1 lg:max-w-screen"
        />,
      );
      expect(container.firstChild).toHaveClass(
        "p-4", "md:p-1", "max-h-screen", "md:max-h-none",
        "max-w-full", "md:max-w-none", "lg:max-w-screen",
        "overflow-hidden", "md:overflow-visible",
      );
      expect(container.firstChild).not.toHaveClass("md:p-0");
    });

    it("preserves layout precedence and consumer overrides without leaking props", () => {
      const style = { color: "red" };
      renderWithProviders(
        <Box
          data-testid="layout-box"
          p={2}
          px={3}
          hMin={{ base: "min", md: "full" }}
          overflowY={{ base: "hidden", lg: "auto" }}
          className="p-4 md:min-h-screen"
          style={style}
        />,
      );

      const box = screen.getByTestId("layout-box");
      expect(box).toHaveClass(
        "p-4", "min-h-min", "md:min-h-screen", "overflow-y-hidden", "lg:overflow-y-auto",
      );
      expect(box).not.toHaveClass("p-2", "px-3", "md:min-h-full");
      expect(box.style.color).toBe("red");
      for (const prop of ["p", "px", "hMin", "overflowY"]) {
        expect(box).not.toHaveAttribute(prop);
      }
    });

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
