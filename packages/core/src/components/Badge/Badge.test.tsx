import React from "react";
import { renderWithProviders, screen } from "../../test-utils";
import { Badge } from "./Badge";
import { BadgePosition, BadgeShape, BadgeSize, BadgeVariant } from "./badge.types";

describe("Badge", () => {
  it("renders children with badge content", () => {
    renderWithProviders(
      <Badge content="5">
        <button>Notifications</button>
      </Badge>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders string content when content is a string", () => {
    renderWithProviders(<Badge content="New">Inbox</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
  });

  it("renders number content when content is a number", () => {
    renderWithProviders(<Badge content={10}>Messages</Badge>);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("renders max+ when content exceeds max", () => {
    renderWithProviders(
      <Badge content={100} max={99}>
        Alerts
      </Badge>,
    );
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
  });

  it("hides badge when visible is false via data attribute", () => {
    const { container } = renderWithProviders(
      <Badge content="Hidden" visible={false}>
        Profile
      </Badge>,
    );
    const badge = container.querySelector("span[data-visible='false']");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("data-[visible=false]:hidden");
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it.each([
    ["top-left", "top-0 left-0 translate-x-[-50%] translate-y-[-50%]"],
    ["top-right", "top-0 right-0 translate-x-[50%] translate-y-[-50%]"],
    ["bottom-left", "bottom-0 left-0 translate-x-[-50%] translate-y-[50%]"],
    ["bottom-right", "bottom-0 right-0 translate-x-[50%] translate-y-[50%]"],
  ])("applies correct classes for position variant %s", (position, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Pos" position={position as BadgePosition}>
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveClass(expectedClasses);
  });

  it.each([
    ["default", "bg-bg-base text-fg-base"],
    ["muted", "bg-bg-muted text-fg-muted"],
    ["primary", "bg-primary-600 text-fg-base"],
    ["secondary", "bg-secondary-600 text-fg-base"],
    ["success", "bg-bg-success text-fg-success"],
    ["warning", "bg-bg-warning text-fg-warning"],
    ["error", "bg-bg-error text-fg-error"],
    ["info", "bg-bg-info text-fg-info"],
  ])("applies correct classes for color variant %s", (color, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Col" color={color as any}>
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveClass(expectedClasses);
  });

  it.each([
    [true, "motion-safe:animate-[ping_1.5s_ease-out_infinite]"],
    [false, ""],
  ])("applies correct classes for ping variant %s", (ping, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Ping" ping={ping}>
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    if (expectedClasses) {
      expect(badge).toHaveClass(expectedClasses);
    } else {
      expect(badge).toBeInTheDocument();
    }
  });

  it.each([
    ["small", "text-xs min-w-4 w-auto h-4"],
    ["medium", "text-sm min-w-6 w-auto h-6"],
    ["large", "text-base min-w-8 w-auto h-8"],
  ])("applies correct classes for size variant %s", (size, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Size" size={size as BadgeSize}>
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveClass(expectedClasses);
  });

  it.each([
    ["standard", ""],
    ["dot", "w-3 h-3 min-w-3 min-h-3 px-0 py-0"],
  ])("applies correct classes for variant %s", (variant, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Var" variant={variant as BadgeVariant}>
        Test
      </Badge>,
    );

    const badge = container.querySelector("span");
    if (expectedClasses) {
      expect(badge).toHaveClass(expectedClasses);
    } else {
      expect(badge).toBeInTheDocument();
    }
  });

  it.each([
    ["rounded", "rounded-md"],
    ["square", "rounded-none"],
    ["circular", "rounded-full"],
  ])("applies correct classes for shape variant %s", (shape, expectedClasses) => {
    const { container } = renderWithProviders(
      <Badge content="Shape" shape={shape as BadgeShape}>
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveClass(expectedClasses);
  });

  it("forwards ref to the badge element", () => {
    const ref = React.createRef<HTMLSpanElement>();
    renderWithProviders(
      <Badge content="Ref" ref={ref}>
        Test
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveTextContent("Ref");
  });

  it("applies ariaLabel when provided", () => {
    const { container } = renderWithProviders(
      <Badge content="5" ariaLabel="5 new messages">
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveAttribute("aria-label", "5 new messages");
  });

  it("sets aria-hidden to true by default", () => {
    const { container } = renderWithProviders(<Badge content="5">Test</Badge>);
    const badge = container.querySelector("span");
    expect(badge).toHaveAttribute("aria-hidden", "true");
  });

  it("does not set aria-hidden when ariaLabel is provided", () => {
    const { container } = renderWithProviders(
      <Badge content="5" ariaLabel="5 notifications">
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).not.toHaveAttribute("aria-hidden");
  });

  it("applies ariaLive when provided", () => {
    const { container } = renderWithProviders(
      <Badge content="5" ariaLive="polite">
        Test
      </Badge>,
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveAttribute("aria-live", "polite");
  });

  it("ping dot does not receive user className", () => {
    const { container } = renderWithProviders(
      <Badge content="5" ping={true} className="custom-class">
        Test
      </Badge>,
    );
    const spans = container.querySelectorAll("span");
    const badgeSpan = spans[0];
    const pingDot = spans[1]; // ping dot is second span
    expect(badgeSpan).toHaveClass("custom-class");
    expect(pingDot).not.toHaveClass("custom-class");
  });
});
