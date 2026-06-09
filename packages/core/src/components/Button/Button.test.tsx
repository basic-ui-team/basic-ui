import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows spinner when loading and no loadingIcon is provided", () => {
    renderWithProviders(<Button loading>Hidden</Button>);
    expect(screen.getByRole("status")).toBeInTheDocument();
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("renders custom loadingIcon when provided", () => {
    renderWithProviders(<Button loading loadingIcon={<span data-testid="custom">X</span>} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("applies native disabled attribute when rendered as button", () => {
    renderWithProviders(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("forwards ref to underlying element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderWithProviders(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("Ref");
  });

  it("anchor with disabled sets aria-disabled and tabIndex", () => {
    const { container } = renderWithProviders(
      <Button as="a" href="/foo" disabled>
        Link
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor).toHaveAttribute("tabindex", "-1");
    expect(anchor).not.toHaveAttribute("disabled");
  });

  it("calls onClick when not disabled and does not call when disabled", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(<Button onClick={handle}>Press</Button>);
    await user.click(screen.getByRole("button"));
    expect(handle).toHaveBeenCalled();

    const handle2 = vi.fn();
    renderWithProviders(
      <Button disabled onClick={handle2}>
        Press
      </Button>,
    );
    await user.click(screen.getAllByRole("button")[1]);
    expect(handle2).not.toHaveBeenCalled();
  });

  it("renders with custom link component when as='a' and linkComponent provided", () => {
    // Mock custom link component (e.g., Next.js Link)
    const CustomLink = React.forwardRef<any, any>(({ href, children, ...props }, ref) => (
      <a ref={ref} href={href} data-testid="custom-link" {...props}>
        {children}
      </a>
    ));
    CustomLink.displayName = "CustomLink";

    const { container } = renderWithProviders(
      <Button as="a" linkComponent={CustomLink} href="/page">
        Navigate
      </Button>,
    );
    const link = container.querySelector('[data-testid="custom-link"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/page");
  });

  it("does not call onClick when loading is true", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(
      <Button loading onClick={handle}>
        Press
      </Button>,
    );
    const btn = screen.getByRole("button");
    await user.click(btn);
    expect(handle).not.toHaveBeenCalled();
  });

  it("loading state sets pointer-events-none via styling", () => {
    const { container } = renderWithProviders(<Button loading>Loading</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("pointer-events-none");
  });

  it("responds to keyboard navigation with Enter key", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(<Button onClick={handle}>Press</Button>);
    const btn = screen.getByRole("button");

    btn.focus();
    await user.keyboard("{Enter}");
    expect(handle).toHaveBeenCalled();
  });

  it("responds to keyboard navigation with Space key", async () => {
    const user = setupUser();
    const handle = vi.fn();
    renderWithProviders(<Button onClick={handle}>Press</Button>);
    const btn = screen.getByRole("button");

    btn.focus();
    await user.keyboard(" ");
    expect(handle).toHaveBeenCalled();
  });

  it("anchor with disabled removes from keyboard navigation (tabindex -1)", () => {
    const { container } = renderWithProviders(
      <Button as="a" href="/foo" disabled>
        Link
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("tabindex", "-1");
  });

  it("anchor with loading removes from keyboard navigation (tabindex -1)", () => {
    const { container } = renderWithProviders(
      <Button as="a" href="/foo" loading>
        Link
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor).toHaveAttribute("tabindex", "-1");
  });

  it("loading state prevents anchor navigation", async () => {
    const { container } = renderWithProviders(
      <Button as="a" href="/page" loading>
        Navigate
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;

    // Verify loading state prevents navigation by checking accessibility attributes and styling
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor).toHaveAttribute("tabindex", "-1");
    expect(anchor).toHaveClass("pointer-events-none");
  });

  it("defaults to type='button' on native button", () => {
    renderWithProviders(<Button>Press</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("does not call onClick for anchor when loading or disabled", async () => {
    const user = setupUser();
    const handle = vi.fn();
    const { container } = renderWithProviders(
      <Button as="a" href="/x" loading onClick={handle}>
        Link
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;
    await user.click(anchor);
    expect(handle).not.toHaveBeenCalled();

    const handle2 = vi.fn();
    const { container: c2 } = renderWithProviders(
      <Button as="a" href="/x" disabled onClick={handle2}>
        Link
      </Button>,
    );
    const anchor2 = c2.querySelector("a") as HTMLAnchorElement;
    await user.click(anchor2);
    expect(handle2).not.toHaveBeenCalled();
  });
});
