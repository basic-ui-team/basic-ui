import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { Skeleton } from "./Skeleton";
import { axe } from "jest-axe";

describe("Skeleton", () => {
  describe("rendering", () => {
    it("renders default text variant with correct classes", () => {
      const { container } = renderWithProviders(<Skeleton />);
      const el = container.firstChild as HTMLElement;
      expect(el).toBeInTheDocument();
      expect(el).toHaveClass("bg-fg-skeleton", "h-4", "rounded-sm");
      expect(el).not.toHaveClass("animate-pulse");
    });

    it("applies rectangular variant classes", () => {
      const { container } = renderWithProviders(<Skeleton variant="rectangular" />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("h-12", "rounded-md");
    });

    it("applies circular variant classes", () => {
      const { container } = renderWithProviders(<Skeleton variant="circular" />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("h-10", "w-10", "rounded-full");
    });

    it("adds animation class when animated", () => {
      const { container } = renderWithProviders(<Skeleton animated />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("animate-pulse");
    });

    it("renders as allowed element via as prop", () => {
      const { container } = renderWithProviders(<Skeleton as="span" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Skeleton ref={ref} />);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("accepts className and style props", () => {
      const { container } = renderWithProviders(
        <Skeleton className="custom-class" style={{ opacity: 0.5 }} />,
      );
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("custom-class");
      expect(el).toHaveStyle({ opacity: "0.5" });
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = renderWithProviders(<Skeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
