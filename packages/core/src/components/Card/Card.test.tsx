import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser, fireEvent } from "../../test-utils";
import { axe } from "jest-axe";
import { Card } from "./index";

describe("Card", () => {
  it("renders as a div by default", () => {
    const { container } = renderWithProviders(<Card>Default</Card>);
    const root = container.firstChild as HTMLElement | null;
    expect(root).toBeInTheDocument();
    expect(root?.tagName).toBe("DIV");
  });

  it("applies elevated variant classes", () => {
    const { container } = renderWithProviders(<Card variant="elevated">Elevated</Card>);
    const root = container.firstChild as HTMLElement | null;
    expect(root).toBeInTheDocument();
    // elevated variant adds a hover:shadow-s5 token
    expect(root).toHaveClass("hover:shadow-s5");
  });

  it("renders as an anchor when href is provided", () => {
    const { container } = renderWithProviders(<Card href="/foo">Link</Card>);
    const anchor = container.querySelector("a");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "/foo");
    // link styling applied
    expect(anchor).toHaveClass("no-underline");
  });

  it("calls onClick when interaction is clickable", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(
      <Card interaction="clickable" onClick={handle}>
        Click me
      </Card>,
    );
    const el = screen.getByText("Click me");
    await user.click(el);
    expect(handle).toHaveBeenCalledOnce();
  });

  it("supports keyboard activation when interaction is both (role=button)", () => {
    const handle = vi.fn();
    const { container } = renderWithProviders(
      <Card interaction="both" onClick={handle}>
        Press
      </Card>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("role", "button");
    // focus + Enter should trigger onClick via key handler
    root.focus();
    fireEvent.keyDown(root, { key: "Enter", code: "Enter", charCode: 13 });
    expect(handle).toHaveBeenCalledOnce();
  });

  it("sets draggable attribute when interaction is draggable", () => {
    const { container } = renderWithProviders(<Card interaction="draggable">Drag</Card>);
    const root = container.firstChild as HTMLElement | null;
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("draggable", "true");
  });

  it("does not call onClick when disabled", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(
      <Card interaction="clickable" disabled onClick={handle}>
        Disabled
      </Card>,
    );
    const el = screen.getByText("Disabled");
    await user.click(el);
    expect(handle).not.toHaveBeenCalled();
  });

  it("applies selected and aria-disabled attributes", () => {
    const { container } = renderWithProviders(
      <Card selected disabled>
        State
      </Card>,
    );
    const root = container.firstChild as HTMLElement | null;
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-selected", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
  });

  it("passes disabled state to Card.Header and Card.Image (section variants)", () => {
    const { container } = renderWithProviders(
      <Card disabled>
        <Card.Header>Head</Card.Header>
        <Card.Image src="/img.png" alt="img" />
      </Card>,
    );

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    // disabled section adds opacity-50
    expect(header).toHaveClass("opacity-50");

    const img = container.querySelector("img[alt=img]");
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass("opacity-50");
  });

  it("is accessible (basic axe check)", async () => {
    const { container } = renderWithProviders(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body content</Card.Body>
      </Card>,
    );
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
