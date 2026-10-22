/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { Badge } from "./Badge";

const Anchor = () => <button type="button">Notifications</button>;

describe("Badge", () => {
  it("renders count content over its anchor", () => {
    renderWithProviders(
      <Badge content={3} color="red">
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("formats numeric counts above max", () => {
    renderWithProviders(
      <Badge content={100} max={99} color="red">
        <Anchor />
      </Badge>,
    );

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it.each([
    ["green", "var(--color-green-200)"],
    ["amber", "var(--color-amber-200)"],
    ["red", "var(--color-red-200)"],
    ["sky", "var(--color-sky-200)"],
  ] as const)("cooks the %s family recipe for dots", (color, bgVariable) => {
    const { container } = renderWithProviders(
      <Badge variant="dot" color={color}>
        <Anchor />
      </Badge>,
    );

    const badge = container.querySelector("[data-slot='badge']") as HTMLElement;
    expect(badge).toHaveClass("bg-(--cr-bg)");
    expect(badge.getAttribute("style")).toContain(`--cr-bg: ${bgVariable}`);
    expect(badge).toHaveTextContent("");
  });

  it("cooks the family recipe for count badges", () => {
    renderWithProviders(
      <Badge content="New" color="green">
        <Anchor />
      </Badge>,
    );

    const badge = screen.getByText("New");
    expect(badge).toHaveClass("bg-(--cr-bg)", "text-(color:--cr-text)");
    expect(badge.getAttribute("style")).toContain("--cr-bg: var(--color-green-200)");
    expect(badge.getAttribute("style")).toContain("--cr-text: var(--color-black)");
  });

  it("renders the default color as the slate family", () => {
    const { container } = renderWithProviders(
      <Badge content="3">
        <Anchor />
      </Badge>,
    );

    const style = container.querySelector("[data-slot='badge']")?.getAttribute("style") ?? "";
    expect(style).toContain("--cr-bg: var(--color-slate-200)");
  });

  it("is decorative by default", () => {
    const { container } = renderWithProviders(
      <Badge content="3" color="sky">
        <Anchor />
      </Badge>,
    );

    expect(container.querySelector("[data-slot='badge']")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("[data-slot='badge']")).not.toHaveAttribute("aria-live");
  });

  it("only adds live-region behavior when it is explicitly requested", () => {
    const { container } = renderWithProviders(
      <Badge content="3" color="sky" aria-label="3 unread notifications" aria-live="polite">
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
      <Badge variant="dot" color="green" ping>
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
      <Badge content="3" color="sky" aria-hidden={false}>
        <Anchor />
      </Badge>,
    );

    expect(warn).toHaveBeenCalledWith("An exposed Badge requires an aria-label.");
    warn.mockRestore();
  });

  it("forwards its ref to the visible indicator", () => {
    const ref = React.createRef<HTMLSpanElement>();
    renderWithProviders(
      <Badge content="3" color="sky" ref={ref}>
        <Anchor />
      </Badge>,
    );

    expect(ref.current).toHaveTextContent("3");
    expect(ref.current).toHaveAttribute("data-slot", "badge");
  });
});
