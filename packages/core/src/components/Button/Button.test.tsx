import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("preserves children while loading without creating an icon", () => {
    renderWithProviders(<Button loading>Submit</Button>);
    const btn = screen.getByRole("button", { name: "Submit" });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(btn.querySelector(".animate-spin")).not.toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("renders custom loadingIcon when provided", () => {
    renderWithProviders(<Button loading loadingIcon={<span data-testid="custom">X</span>} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("replaces children with loadingText while busy", () => {
    renderWithProviders(
      <Button loading loadingText="Submitting">Submit</Button>,
    );
    expect(screen.getByRole("button", { name: "Submitting" })).toBeDisabled();
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });

  it("leaves custom loading icon sizing and styling untouched", () => {
    const LoadingIcon = () => (
      <svg data-testid="styled-loader" className="h-9 w-9 text-sky-600" />
    );
    renderWithProviders(
      <Button loading size={{ base: "sm", md: "lg" }} loadingIcon={<LoadingIcon />}>
        Submit
      </Button>,
    );
    const icon = screen.getByTestId("styled-loader");
    expect(icon).toHaveAttribute("class", "h-9 w-9 text-sky-600");
    expect(icon.parentElement).toBe(screen.getByRole("button", { name: "Submit" }));
  });

  it("ignores loading-only content when not busy", () => {
    renderWithProviders(
      <Button loadingText="Submitting" loadingIcon={<span data-testid="unused-loader" />}>
        Submit
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("aria-busy", "false");
    expect(screen.queryByTestId("unused-loader")).not.toBeInTheDocument();
    expect(screen.queryByText("Submitting")).not.toBeInTheDocument();
  });

  it.each([
    ["sm", "px-2 py-1 text-sm gap-1 rounded-md"],
    ["md", "px-4 py-2 text-md gap-2 rounded-lg"],
    ["lg", "px-6 py-3 text-lg gap-3 rounded-xl"],
  ] as const)("preserves %s size utilities", (size, classes) => {
    renderWithProviders(<Button size={size}>Submit</Button>);
    expect(screen.getByRole("button")).toHaveClass(...classes.split(" "));
  });

  it("prefixes only size utilities, preserving scalar appearance and state", () => {
    renderWithProviders(
      <Button
        size={{ base: "sm", md: "lg", xl: "md" }}
        variant="outline"
        color="emerald"
        disabled
        loading
      >
        Submit
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "px-2", "py-1", "text-sm", "gap-1", "rounded-md",
      "inline-flex", "border-2",
      "text-(color:--cr-text)",
      "cursor-not-allowed",
    );
    expect(button.getAttribute("style")).toContain("--cr-text: var(--color-emerald-700)");
    expect([...button.classList].filter((name) => name.startsWith("md:"))).toEqual([
      "md:px-6", "md:py-3", "md:text-lg", "md:gap-3", "md:rounded-xl",
    ]);
    expect([...button.classList].filter((name) => name.startsWith("xl:"))).toEqual([
      "xl:px-4", "xl:py-2", "xl:text-md", "xl:gap-2", "xl:rounded-lg",
    ]);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toHaveAttribute("size");
  });


  it("preserves consumer class overrides with responsive sizing", () => {
    renderWithProviders(
      <Button size={{ base: "sm", md: "lg" }} className="hidden px-9 md:px-1">
        Submit
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hidden", "px-9", "md:px-1");
    expect(button).not.toHaveClass("inline-flex", "md:inline-flex", "px-2", "md:px-4");
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

  it("loading preserves cursor hit-testing while disabling native activation", () => {
    const { container } = renderWithProviders(<Button loading>Loading</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("cursor-progress");
    expect(btn).not.toHaveClass("pointer-events-none");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
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

  it.each(["loading", "disabled"] as const)("%s prevents anchor navigation without pointer-event blocking", (state) => {
    const handle = vi.fn();
    const { container } = renderWithProviders(
      <Button as="a" href="/page" loading={state === "loading"} disabled={state === "disabled"} onClick={handle}>
        Navigate
      </Button>,
    );
    const anchor = container.querySelector("a") as HTMLAnchorElement;

    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor).toHaveAttribute("tabindex", "-1");
    expect(anchor).not.toHaveClass("pointer-events-none");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(handle).not.toHaveBeenCalled();
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

describe("Button color recipes", () => {
  it("applies recipe utilities and variables for the default color", () => {
    renderWithProviders(<Button>Painted</Button>);
    const btn = screen.getByRole("button", { name: "Painted" });
    expect(btn).toHaveClass("bg-(--cr-bg)");
    const style = btn.getAttribute("style") ?? "";
    expect(style).toContain("--cr-bg: var(--color-red-700)");
    expect(style).toContain("--cr-bg-hover: var(--color-red-600)");
    expect(style).toContain("--cr-bg-dark: var(--color-red-700)");
  });

  it("cooks recipes per palette family and variant", () => {
    renderWithProviders(<Button color="teal" variant="link">Link</Button>);
    const btn = screen.getByRole("button", { name: "Link" });
    expect(btn).toHaveClass("text-(color:--cr-text)");
    const style = btn.getAttribute("style") ?? "";
    expect(style).toContain("--cr-text: var(--color-teal-700)");
    expect(style).toContain("--cr-text-dark: var(--color-teal-200)");
  });

  it("falls back to the light recipe when a dark recipe is omitted", () => {
    renderWithProviders(<Button color="teal">Plain</Button>);
    const style = screen.getByRole("button", { name: "Plain" }).getAttribute("style") ?? "";
    expect(style).toContain("--cr-text: var(--color-white)");
    expect(style).toContain("--cr-text-dark: var(--color-white)");
  });

  it("applies explicit ghost focus paints in both themes", () => {
    renderWithProviders(<Button variant="ghost" color="teal">Ghost</Button>);
    const style = screen.getByRole("button", { name: "Ghost" }).getAttribute("style") ?? "";
    expect(style).toContain("--cr-bg-focus: var(--color-teal-500)");
    expect(style).toContain("--cr-bg-focus-dark: var(--color-teal-500)");
  });
});
