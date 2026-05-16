import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders description content", () => {
      renderWithProviders(<Alert>Error message</Alert>);
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      renderWithProviders(<Alert title="Title">Description</Alert>);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("does not render title slot when title is not provided", () => {
      const { container } = renderWithProviders(<Alert>Description</Alert>);
      expect(container.querySelector("[class*='alert-title']")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = renderWithProviders(<Alert className="custom-class">Test</Alert>);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("semantic roles", () => {
    it.each([
      ["error", "alert"],
      ["warning", "alert"],
      ["info", "status"],
      ["success", "status"],
    ])("uses role='%s' for severity %s", (severity, expectedRole) => {
      const { container } = renderWithProviders(<Alert severity={severity as any}>Test</Alert>);
      expect(container.firstChild).toHaveAttribute("role", expectedRole);
    });
  });

  describe("icon behavior", () => {
    it("renders default icon based on severity", () => {
      const { container } = renderWithProviders(<Alert severity="success">Test</Alert>);
      // Icon component renders SVG, not img element
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("hides icon when icon={false}", () => {
      const { container } = renderWithProviders(<Alert icon={false}>Test</Alert>);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      const CustomIcon = <span data-testid="custom-icon">🎉</span>;
      renderWithProviders(<Alert icon={CustomIcon}>Test</Alert>);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("respects custom icon map", () => {
      const CustomCheckIcon = <span data-testid="custom-check">✓</span>;
      renderWithProviders(
        <Alert severity="success" iconMap={{ success: CustomCheckIcon }}>
          Test
        </Alert>,
      );
      expect(screen.getByTestId("custom-check")).toBeInTheDocument();
    });
  });

  describe("dismissal", () => {
    it("does not render dismiss button by default", () => {
      renderWithProviders(<Alert>Description</Alert>);
      expect(screen.queryByLabelText("Dismiss alert")).not.toBeInTheDocument();
    });

    it("renders dismiss button when onDismiss is provided", () => {
      renderWithProviders(<Alert onDismiss={() => {}}>Test</Alert>);
      expect(screen.getByLabelText("Dismiss alert")).toBeInTheDocument();
    });

    it("calls onDismiss callback when alert is dismissed", async () => {
      const handleDismiss = vi.fn();
      renderWithProviders(<Alert onDismiss={handleDismiss}>Test</Alert>);

      const button = screen.getByLabelText("Dismiss alert");
      const user = setupUser();
      await user.click(button);
      expect(handleDismiss).toHaveBeenCalledOnce();
    });
  });

  describe("visibility control", () => {
    it("renders when isOpen={true} (default)", () => {
      renderWithProviders(<Alert>Visible</Alert>);
      expect(screen.getByText("Visible")).toBeInTheDocument();
    });

    it("does not render when isOpen={false}", () => {
      renderWithProviders(<Alert isOpen={false}>Hidden</Alert>);
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("respects isOpen prop even when onDismiss is provided", () => {
      renderWithProviders(
        <Alert onDismiss={() => {}} isOpen={false}>
          Hidden
        </Alert>,
      );
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Dismiss alert")).not.toBeInTheDocument();
    });
  });

  describe("styling variants", () => {
    it.each(["success", "error", "warning", "info"])(
      "renders with %s severity variant",
      (severity) => {
        const { container } = renderWithProviders(<Alert severity={severity as any}>Test</Alert>);
        expect(container.firstChild).toBeInTheDocument();
      },
    );

    it("applies borderless variant when borderless={true}", () => {
      const { container } = renderWithProviders(<Alert borderless>Test</Alert>);
      // borderless applies border-0 p-0 classes
      const el = container.firstChild;
      expect(el && el instanceof HTMLElement && el.className).toMatch(
        /border-0.*p-0|p-0.*border-0/,
      );
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to container div by default", () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithProviders(<Alert ref={ref}>Test</Alert>);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("forwards ref to span element when as='span'", () => {
      const ref = React.createRef<HTMLSpanElement>();
      renderWithProviders(
        <Alert as="span" ref={ref}>
          Test
        </Alert>,
      );
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("SPAN");
    });

    it("forwards ref to p element when as='p'", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      renderWithProviders(
        <Alert as="p" ref={ref}>
          Test
        </Alert>,
      );
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("P");
    });
  });

  describe("polymorphic rendering", () => {
    it("renders as div by default", () => {
      const { container } = renderWithProviders(<Alert>Test</Alert>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders as span when as='span'", () => {
      const { container } = renderWithProviders(<Alert as="span">Test</Alert>);
      expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("renders as p when as='p'", () => {
      const { container } = renderWithProviders(<Alert as="p">Test</Alert>);
      expect(container.firstChild?.nodeName).toBe("P");
    });

    it("maintains component props regardless of as value", () => {
      const { container: divContainer } = renderWithProviders(
        <Alert severity="error" title="Error">
          Div alert
        </Alert>,
      );
      const { container: spanContainer } = renderWithProviders(
        <Alert as="span" severity="error" title="Error">
          Span alert
        </Alert>,
      );

      expect(divContainer.firstChild).toHaveAttribute("role", "alert");
      expect(spanContainer.firstChild).toHaveAttribute("role", "alert");
      expect(screen.getAllByText("Error")).toHaveLength(2);
    });

    it("passes element-specific native props correctly", () => {
      const { container } = renderWithProviders(
        <Alert as="p" id="alert-para" data-testid="alert-element">
          Paragraph alert
        </Alert>,
      );
      const el = container.firstChild;
      expect(el).toHaveAttribute("id", "alert-para");
      expect(el).toHaveAttribute("data-testid", "alert-element");
    });
  });
});
