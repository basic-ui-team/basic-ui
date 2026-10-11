/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Badge } from "./Badge";

const Anchor = () => <button type="button">Notifications</button>;

describe("Badge", () => {
  it("renders count content over its anchor", () => {
    renderWithProviders(
      <Badge content={3} color="error">
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("formats numeric counts above max", () => {
    renderWithProviders(
      <Badge content={100} max={99} color="error">
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it.each([
    ["sm", "min-h-5", "min-w-5"],
    ["md", "min-h-6", "min-w-6"],
    ["lg", "min-h-7", "min-w-7"],
  ] as const)("uses the %s count size recipe", (size, minHeight, minWidth) => {
    renderWithProviders(
      <Badge content="3" color="info" size={size}>
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("3")).toHaveClass(minHeight, minWidth);
  });

  it.each([
    ["success", "bg-border-success"],
    ["warning", "bg-border-warning"],
    ["error", "bg-border-error"],
    ["info", "bg-border-info"],
  ] as const)("uses the stronger %s token for dots", (color, expectedClass) => {
    const { container } = renderWithProviders(
      <Badge variant="dot" color={color}>
        <Anchor />
      </Badge>,
    );

    expect(container.querySelector("[data-slot='badge']")).toHaveClass(expectedClass);
    expect(container.querySelector("[data-slot='badge']")).toHaveTextContent("");
  });

  it("uses semantic background and foreground tokens for count badges", () => {
    renderWithProviders(
      <Badge content="New" color="success">
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("New")).toHaveClass(
      "bg-bg-success",
      "text-fg-success",
    );
  });

  it("is decorative by default", () => {
    const { container } = renderWithProviders(
      <Badge content="3" color="info">
        <Anchor />
      </Badge>,
    );

    expect(container.querySelector("[data-slot='badge']")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("[data-slot='badge']")).not.toHaveAttribute("aria-live");
  });

  it("only adds live-region behavior when it is explicitly requested", () => {
    const { container } = renderWithProviders(
      <Badge
        content="3"
        color="info"
        aria-label="3 unread notifications"
        aria-live="polite"
      >
        <Anchor />
      </Badge>,
    );

    const badge = container.querySelector("[data-slot='badge']");
    expect(badge).not.toHaveAttribute("aria-hidden");
    expect(badge).toHaveAttribute("aria-label", "3 unread notifications");
    expect(badge).toHaveAttribute("aria-live", "polite");
  });

  it("renders a decorative ping halo behind a stable visible dot", () => {
    const { container } = renderWithProviders(
      <Badge variant="dot" color="success" ping>
        <Anchor />
      </Badge>,
    );

    const ping = container.querySelector("[data-slot='badge-ping']");
    const badge = container.querySelector("[data-slot='badge']");
    expect(ping).toHaveAttribute("aria-hidden", "true");
    expect(ping).toHaveClass("motion-safe:animate-[ping_1.5s_ease-out_infinite]");
    expect(badge).not.toHaveClass("motion-safe:animate-[ping_1.5s_ease-out_infinite]");
  });

  it("warns when an exposed badge has no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWithProviders(
      <Badge content="3" color="info" aria-hidden={false}>
        <Anchor />
      </Badge>,
    );

    expect(warn).toHaveBeenCalledWith("An exposed Badge requires an aria-label.");
    warn.mockRestore();
  });

  it("forwards its ref to the visible indicator", () => {
    const ref = React.createRef<HTMLSpanElement>();
    renderWithProviders(
      <Badge content="3" color="info" ref={ref}>
        <Anchor />
      </Badge>,
    );

    expect(ref.current).toHaveTextContent("3");
    expect(ref.current).toHaveAttribute("data-slot", "badge");
  });
});
