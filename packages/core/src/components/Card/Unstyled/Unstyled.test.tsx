import { describe, it, expect, vi } from "vitest";
import React from "react";
import { CardUnstyled } from "./Unstyled";
import { renderWithProviders, screen, setupUser, fireEvent } from "../../../test-utils";

describe("CardUnstyled", () => {
  it("renders as a div by default", () => {
    const { container } = renderWithProviders(<CardUnstyled>U</CardUnstyled>);
    const root = container.firstChild as HTMLElement | null;
    expect(root).toBeInTheDocument();
    expect(root?.tagName).toBe("DIV");
  });

  it("renders as an anchor when href is provided", () => {
    const { container } = renderWithProviders(<CardUnstyled href="/foo">Link</CardUnstyled>);
    const a = container.querySelector("a");
    expect(a).toBeInTheDocument();
    expect(a).toHaveAttribute("href", "/foo");
  });

  it("calls onClick when interaction is clickable", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(
      <CardUnstyled interaction="clickable" onClick={handle}>
        Click
      </CardUnstyled>,
    );
    const el = screen.getByText("Click");
    await user.click(el);
    expect(handle).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(
      <CardUnstyled interaction="clickable" disabled onClick={handle}>
        Disabled
      </CardUnstyled>,
    );
    const el = screen.getByText("Disabled");
    await user.click(el);
    expect(handle).not.toHaveBeenCalled();
  });

  it("sets draggable attribute when interaction is draggable", () => {
    const { container } = renderWithProviders(<CardUnstyled interaction="draggable">D</CardUnstyled>);
    const root = container.firstChild as HTMLElement | null;
    expect(root).toHaveAttribute("draggable", "true");
  });

  it("supports keyboard activation (role=button) when interaction is both", () => {
    const handle = vi.fn();
    const { container } = renderWithProviders(
      <CardUnstyled interaction="both" onClick={handle}>
        Press
      </CardUnstyled>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("role", "button");
    root.focus();
    fireEvent.keyDown(root, { key: "Enter", code: "Enter", charCode: 13 });
    expect(handle).toHaveBeenCalledOnce();
  });
});
