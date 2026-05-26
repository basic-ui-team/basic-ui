import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Grid } from "./Grid";
import { axe } from "jest-axe";

describe("Grid", () => {
  describe("rendering", () => {
    it("renders children and applies className", () => {
      const { container } = renderWithProviders(<Grid className="custom-class">Hello</Grid>);
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("defaults to a div element", () => {
      const { container } = renderWithProviders(<Grid>Hi</Grid>);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("renders as allowed element via as prop", () => {
      const { container } = renderWithProviders(<Grid as="main">Main</Grid>);
      expect(container.querySelector("main")).toBeInTheDocument();
    });

    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Grid ref={ref}>Ref</Grid>);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });
  });

  describe("variants", () => {
    it("applies cols classes for token counts", () => {
      const { container } = renderWithProviders(<Grid cols={3}>Test</Grid>);
      expect(container.firstChild).toHaveClass("grid-cols-3");
    });

    it("applies rows classes for token counts", () => {
      const { container } = renderWithProviders(<Grid rows={2}>Test</Grid>);
      expect(container.firstChild).toHaveClass("grid-rows-2");
    });

    it("applies gap token classes", () => {
      const { container } = renderWithProviders(<Grid gap="md">Test</Grid>);
      expect(container.firstChild).toHaveClass("gap-md");
    });

    it("applies rowGap/columnGap token classes", () => {
      const { container } = renderWithProviders(
        <Grid rowGap="sm" columnGap="lg">
          Test
        </Grid>,
      );
      expect(container.firstChild).toHaveClass("row-gap-sm");
      expect(container.firstChild).toHaveClass("column-gap-lg");
    });

    it("applies alignment classes", () => {
      const { container } = renderWithProviders(
        <Grid alignItems="start" justifyItems="center">
          Test
        </Grid>,
      );
      expect(container.firstChild).toHaveClass("items-start");
      expect(container.firstChild).toHaveClass("justify-items-center");
    });

    it("resolves responsive objects to base when no breakpoint matches", () => {
      const { container } = renderWithProviders(<Grid cols={{ base: 2, md: 4 }}>Test</Grid>);
      expect(container.firstChild).toHaveClass("grid-cols-2");
    });
  });

  describe("custom values", () => {
    it("accepts custom gap via className escape hatch", () => {
      const { container } = renderWithProviders(<Grid className="gap-8">X</Grid>);
      expect(container.firstChild).toHaveClass("gap-8");
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = renderWithProviders(
        <Grid>
          <div>child</div>
        </Grid>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
