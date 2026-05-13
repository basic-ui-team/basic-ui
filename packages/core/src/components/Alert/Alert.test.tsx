import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders description content", () => {
      render(<Alert description="Error message" />);
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<Alert title="Title" description="Description" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("does not render title slot when title is not provided", () => {
      const { container } = render(<Alert description="Description" />);
      expect(container.querySelector("[class*='alert-title']")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<Alert description="Test" className="custom-class" />);
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
      const { container } = render(<Alert severity={severity as any} description="Test" />);
      expect(container.firstChild).toHaveAttribute("role", expectedRole);
    });
  });

  describe("icon behavior", () => {
    it("renders default icon based on severity", () => {
      const { container } = render(<Alert severity="success" description="Test" />);
      // Icon component renders SVG, not img element
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("hides icon when icon={false}", () => {
      const { container } = render(<Alert icon={false} description="Test" />);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      const CustomIcon = () => <span data-testid="custom-icon">🎉</span>;
      render(<Alert icon={<CustomIcon />} description="Test" />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("respects custom icon map", () => {
      const CustomCheckIcon = () => <span data-testid="custom-check">✓</span>;
      render(
        <Alert severity="success" description="Test" iconMap={{ success: CustomCheckIcon() }} />,
      );
      expect(screen.getByTestId("custom-check")).toBeInTheDocument();
    });
  });

  describe("dismissal", () => {
    it("does not render dismiss button by default", () => {
      render(<Alert description="Test" />);
      expect(screen.queryByLabelText("Dismiss alert")).not.toBeInTheDocument();
    });

    it("renders dismiss button when dismissible={true}", () => {
      render(<Alert dismissible description="Test" />);
      expect(screen.getByLabelText("Dismiss alert")).toBeInTheDocument();
    });

    it("hides alert when dismiss button is clicked", async () => {
      render(<Alert dismissible description="Test alert" />);
      expect(screen.getByText("Test alert")).toBeInTheDocument();

      const button = screen.getByLabelText("Dismiss alert");
      await user.click(button);
      expect(screen.queryByText("Test alert")).not.toBeInTheDocument();
    });

    it("calls onDismiss callback when alert is dismissed", async () => {
      const handleDismiss = vi.fn();
      render(<Alert dismissible description="Test" onDismiss={handleDismiss} />);

      const button = screen.getByLabelText("Dismiss alert");
      await user.click(button);
      expect(handleDismiss).toHaveBeenCalledOnce();
    });
  });

  describe("visibility control", () => {
    it("renders when isOpen={true} (default)", () => {
      render(<Alert description="Visible" />);
      expect(screen.getByText("Visible")).toBeInTheDocument();
    });

    it("does not render when isOpen={false}", () => {
      render(<Alert isOpen={false} description="Hidden" />);
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("respects isOpen prop even when dismissible", () => {
      render(<Alert dismissible isOpen={false} description="Hidden" />);
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Dismiss alert")).not.toBeInTheDocument();
    });
  });

  describe("styling variants", () => {
    it.each(["success", "error", "warning", "info"])(
      "renders with %s severity variant",
      (severity) => {
        const { container } = render(<Alert severity={severity as any} description="Test" />);
        expect(container.firstChild).toBeInTheDocument();
      },
    );

    it("applies borderless variant when borderless={true}", () => {
      const { container } = render(<Alert borderless description="Test" />);
      // borderless applies border-0 p-0 classes
      const el = container.firstChild;
      expect(el && el instanceof HTMLElement && el.className).toMatch(
        /border-0.*p-0|p-0.*border-0/,
      );
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to container div", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref} description="Test" />);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.tagName).toBe("DIV");
    });
  });

  describe("html attributes", () => {
    it("spreads additional props to container", () => {
      const { container } = render(<Alert description="Test" data-custom="value" />);
      expect(container.firstChild).toHaveAttribute("data-custom", "value");
    });
  });
});
