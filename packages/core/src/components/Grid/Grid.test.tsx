import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Grid } from "./Grid";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";

describe("Grid", () => {
  it("restores latest column and row counts after a preset without viewport state", () => {
    const markup = renderToString(
      <Grid
        cols={{ base: 2, md: 4 }}
        rows={{ base: 3, lg: 5 }}
        templatePreset={{ base: "none", sm: "sidebar", xl: "none" }}
        rowGap={{ base: 1, md: 3 }}
        columnGap={{ base: 2, lg: 4 }}
      />,
    );
    expect(markup).toContain("grid-cols-2");
    expect(markup).toContain("grid-rows-3");
    expect(markup).toContain("sm:grid-cols-[200px_1fr]");
    expect(markup).toContain("sm:grid-rows-none");
    expect(markup).toContain("md:grid-cols-[200px_1fr]");
    expect(markup).toContain("xl:grid-cols-4");
    expect(markup).toContain("xl:grid-rows-5");
    expect(markup).toContain("md:gap-y-3");
    expect(markup).toContain("lg:gap-x-4");
    expect(markup).not.toContain("md:grid ");
  });

  it("preserves explicit class overrides at matching breakpoints", () => {
    const { container } = renderWithProviders(
      <Grid cols={{ base: 2, md: 4 }} className="md:grid-cols-6" />,
    );
    expect(container.firstChild).toHaveClass("grid-cols-2", "md:grid-cols-6");
    expect(container.firstChild).not.toHaveClass("md:grid-cols-4");
  });

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

    it("sets row and column counts to undefined when a templatePreset is used", () => {
      const { container } = renderWithProviders(<Grid templatePreset="masonry">Test</Grid>);
      expect(container.firstChild).not.toHaveClass("grid-cols-");
      expect(container.firstChild).not.toHaveClass("grid-rows-");
    });

    it.each<["row" | "column" | "dense", string]>([
      ["row", "row"],
      ["column", "col"],
      ["dense", "dense"],
    ])("applies correct autoFlow class when autoFlow is %s", (flow, expected) => {
      const { container } = renderWithProviders(<Grid autoFlow={flow}>Test</Grid>);
      expect(container.firstChild).toHaveClass(`grid-flow-${expected}`);
    });

    it("applies gap token classes", () => {
      const { container } = renderWithProviders(<Grid gap={3}>Test</Grid>);
      expect(container.firstChild).toHaveClass("gap-3");
    });

    it("applies rowGap/columnGap token classes", () => {
      const { container } = renderWithProviders(
        <Grid rowGap={2} columnGap={4}>
          Test
        </Grid>,
      );
      expect(container.firstChild).toHaveClass("gap-y-2");
      expect(container.firstChild).toHaveClass("gap-x-4");
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
