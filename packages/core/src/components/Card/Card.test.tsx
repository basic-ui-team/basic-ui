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

  describe.each([
    ["Card", Card],
    ["Card.Unstyled", Card.Unstyled],
  ])("%s interactions", (_name, Component) => {
    it("disables native buttons for pointer and keyboard activation", () => {
      const onClick = vi.fn();
      renderWithProviders(
        <Component interaction="clickable" disabled onClick={onClick}>
          Disabled button
        </Component>,
      );
      const button = screen.getByText("Disabled button");

      expect(button).toBeDisabled();
      fireEvent.click(button);
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.keyDown(button, { key: " " });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not activate a disabled non-native button on Enter or Space", () => {
      const onClick = vi.fn();
      renderWithProviders(
        <Component interaction="both" disabled onClick={onClick}>
          Disabled interactive card
        </Component>,
      );
      const card = screen.getByText("Disabled interactive card");

      expect(card).toHaveAttribute("tabindex", "-1");
      fireEvent.keyDown(card, { key: "Enter" });
      fireEvent.keyDown(card, { key: " " });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("invokes href click handlers and retains native link keyboard behavior", async () => {
      const user = setupUser();
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      renderWithProviders(
        <Component href="/destination" onClick={onClick}>
          Link card
        </Component>,
      );
      const link = screen.getByRole("link", { name: "Link card" });

      await user.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
      link.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(2);
      expect(onClick.mock.calls[1][0].type).toBe("click");
    });

    it("prevents disabled links from navigating or activating", () => {
      const onClick = vi.fn();
      renderWithProviders(
        <Component href="/destination" disabled onClick={onClick}>
          Disabled link
        </Component>,
      );
      const link = screen.getByText("Disabled link");

      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
      expect(link).not.toHaveAttribute("href");
      fireEvent.click(link);
      fireEvent.keyDown(link, { key: "Enter" });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("activates a non-native interactive card with a click event", () => {
      const onClick = vi.fn();
      renderWithProviders(
        <Component interaction="both" onClick={onClick}>
          Interactive card
        </Component>,
      );

      fireEvent.keyDown(screen.getByText("Interactive card"), { key: "Enter" });
      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick.mock.calls[0][0].type).toBe("click");
    });

    it("uses native keyboard activation for buttons without double-firing", async () => {
      const user = setupUser();
      const onClick = vi.fn();
      renderWithProviders(
        <Component interaction="clickable" onClick={onClick}>
          Enabled button
        </Component>,
      );
      screen.getByRole("button", { name: "Enabled button" }).focus();
      await user.keyboard("{Enter}");
      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(2);
      expect(onClick.mock.calls.map(([event]) => event.type)).toEqual(["click", "click"]);
    });

    it("allows consumers to cancel keyboard activation", () => {
      const onClick = vi.fn();
      const onKeyDown = vi.fn((event: React.KeyboardEvent) => event.preventDefault());
      renderWithProviders(
        <Component interaction="both" onClick={onClick} onKeyDown={onKeyDown}>
          Cancelled card
        </Component>,
      );
      fireEvent.keyDown(screen.getByText("Cancelled card"), { key: "Enter" });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onClick).not.toHaveBeenCalled();
    });

    it("keeps explicitly disabled cards out of the tab order", () => {
      renderWithProviders(
        <Component href="/destination" disabled tabIndex={0}>
          Disabled link
        </Component>,
      );
      expect(screen.getByText("Disabled link")).toHaveAttribute("tabindex", "-1");
    });

    it("supports keyboard activation on an anchor without an href", () => {
      const onClick = vi.fn();
      renderWithProviders(
        <Component as="a" interaction="both" onClick={onClick}>
          Interactive anchor
        </Component>,
      );
      const card = screen.getByRole("button", { name: "Interactive anchor" });
      fireEvent.keyDown(card, { key: "Enter" });

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick.mock.calls[0][0].type).toBe("click");
    });
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
