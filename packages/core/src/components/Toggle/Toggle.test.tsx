import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch with aria-checked false by default", () => {
    renderWithProviders(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("renders defaultChecked uncontrolled state", () => {
    renderWithProviders(<Toggle defaultValue />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on click in uncontrolled mode", async () => {
    const user = setupUser();
    renderWithProviders(<Toggle />);
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("activates with Space and Enter", async () => {
    const user = setupUser();
    renderWithProviders(<Toggle />);
    const toggle = screen.getByRole("switch");
    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the next value in controlled mode", async () => {
    const user = setupUser();
    const handleChange = vi.fn();
    renderWithProviders(<Toggle value={false} onChange={handleChange} />);
    await user.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("honors controlled value from outside", () => {
    renderWithProviders(<Toggle value onChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = setupUser();
    const handleChange = vi.fn();
    renderWithProviders(<Toggle disabled onChange={handleChange} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("applies native button attributes", () => {
    renderWithProviders(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle).toHaveAttribute("type", "button");
  });

  it("forwards ref to underlying element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderWithProviders(<Toggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets data-checked for styling hooks", async () => {
    const user = setupUser();
    renderWithProviders(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).not.toHaveAttribute("data-checked");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-checked", "true");
  });

  it("respects an externally provided id and aria wiring", () => {
    renderWithProviders(
      <Toggle id="custom-toggle" aria-labelledby="external-label" />,
    );
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("id", "custom-toggle");
    expect(toggle).toHaveAttribute("aria-labelledby", "external-label");
  });
});
