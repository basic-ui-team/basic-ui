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
    renderWithProviders(
      <Button ref={ref}>
        Ref
      </Button>,
    );
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
});
