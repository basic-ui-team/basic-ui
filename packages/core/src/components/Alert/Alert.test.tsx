/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders visible subtle alert content with its title and default icon", () => {
    const { container } = renderWithProviders(
      <Alert title="Updated">Your profile was updated.</Alert>,
    );

    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("Your profile was updated.")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border", "bg-bg-info");
  });

  it.each<["error" | "warning" | "info" | "success", "alert" | "status"]>([
    ["error", "alert"],
    ["warning", "alert"],
    ["info", "status"],
    ["success", "status"],
  ])("uses the %s role for %s alerts", (severity, role) => {
    renderWithProviders(<Alert severity={severity}>Message</Alert>);

    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it("renders an outlined alert without the subtle semantic background", () => {
    const { container } = renderWithProviders(
      <Alert severity="warning" variant="outline">
        Check your settings.
      </Alert>,
    );

    expect(container.firstChild).toHaveClass("border-2", "bg-surface-base", "border-border-warning");
    expect(container.firstChild).not.toHaveClass("bg-bg-warning");
  });

  it("supports custom icons and removes the icon slot when disabled", () => {
    const { container, rerender } = renderWithProviders(
      <Alert icon={<span data-testid="custom-icon">!</span>}>Message</Alert>,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();

    rerender(<Alert icon={false}>Message</Alert>);

    expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    expect(container.firstChild?.childNodes).toHaveLength(1);
  });

  it("only renders the actions slot when an action or dismiss button is present", () => {
    const { container, rerender } = renderWithProviders(<Alert>Message</Alert>);

    expect(container.firstChild?.childNodes).toHaveLength(2);

    rerender(
      <Alert action={<button type="button">Retry</button>}>
        Message
      </Alert>,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("closes uncontrolled dismissible alerts", async () => {
    renderWithProviders(<Alert dismissible>Message</Alert>);

    await setupUser().click(screen.getByRole("button", { name: "Dismiss alert" }));

    expect(screen.queryByText("Message")).not.toBeInTheDocument();
  });

  it("honors defaultOpen before its first render", () => {
    renderWithProviders(<Alert defaultOpen={false}>Message</Alert>);

    expect(screen.queryByText("Message")).not.toBeInTheDocument();
  });

  it("requests closure from controlled alerts and supports reopening", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = renderWithProviders(
      <Alert open dismissible onOpenChange={onOpenChange}>
        Message
      </Alert>,
    );

    await setupUser().click(screen.getByRole("button", { name: "Dismiss alert" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("Message")).toBeInTheDocument();

    rerender(
      <Alert open={false} dismissible onOpenChange={onOpenChange}>
        Message
      </Alert>,
    );
    expect(screen.queryByText("Message")).not.toBeInTheDocument();

    rerender(
      <Alert open dismissible onOpenChange={onOpenChange}>
        Message
      </Alert>,
    );
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("forwards refs and supports section roots", () => {
    const ref = React.createRef<HTMLElement>();
    renderWithProviders(
      <Alert as="section" ref={ref} data-testid="alert">
        Message
      </Alert>,
    );

    expect(screen.getByTestId("alert").tagName).toBe("SECTION");
    expect(ref.current).toBe(screen.getByTestId("alert"));
  });
});
