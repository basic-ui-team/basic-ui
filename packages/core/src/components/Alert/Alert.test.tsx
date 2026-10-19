/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders visible filled alert content with its title and default icon", () => {
    const { container } = renderWithProviders(
      <Alert title="Updated">Your profile was updated.</Alert>,
    );

    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("Your profile was updated.")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-(--cr-bg)", "text-(color:--cr-text)");
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-bg: var(--color-sky-200)",
    );
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

    expect(container.firstChild).toHaveClass("border-2", "border-(--cr-border)");
    expect(container.firstChild).not.toHaveClass("bg-(--cr-bg)");
    expect(container.firstChild).not.toHaveClass("bg-(--cr-bg)");
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-border: var(--color-amber-300)",
    );
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

  it("cooks a custom color override while keeping the severity role", () => {
    const { container } = renderWithProviders(
      <Alert severity="error" color="teal">
        Message
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-bg: var(--color-teal-200)",
    );
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-text: var(--color-black)",
    );
  });

  it("renders a filled alert with an opaque family background", () => {
    const { container } = renderWithProviders(
      <Alert severity="info" variant="filled">
        Message
      </Alert>,
    );

    expect(container.firstChild).toHaveClass("bg-(--cr-bg)", "text-(color:--cr-text)");
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-bg: var(--color-sky-200)",
    );
    expect((container.firstChild as HTMLElement).getAttribute("style")).toContain(
      "--cr-text: var(--color-black)",
    );
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
