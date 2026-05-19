import React from "react";
import { describe, expect, it } from "vitest";
import { headerVariants } from "./header.variants";
import { Header } from "./Header";
import { renderWithProviders } from "@core/test-utils/renderWithProviders";
import { axe } from "jest-axe";

describe("variants", () => {
  const sizeMap: Record<string, string> = {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-xl",
    h4: "text-lg",
    h5: "text-base",
    h6: "text-sm",
  };

  const weightMap: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorMap: Record<string, string> = {
    default: "text-foreground-primary",
    primary: "text-primary-700",
    secondary: "text-secondary-700",
  };

  const alignMap: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const wrapMap: Record<string, string> = {
    nowrap: "text-nowrap",
    wrap: "text-wrap",
    balance: "text-balance",
    pretty: "text-pretty",
  };

  it.each([
    ["size", "h1"],
    ["size", "h2"],
    ["size", "h3"],
    ["size", "h4"],
    ["size", "h5"],
    ["size", "h6"],
    ["weight", "normal"],
    ["weight", "medium"],
    ["weight", "semibold"],
    ["weight", "bold"],
    ["color", "default"],
    ["color", "primary"],
    ["color", "secondary"],
    ["align", "left"],
    ["align", "center"],
    ["align", "right"],
    ["truncate", true],
    ["truncate", false],
    ["wrap", "nowrap"],
    ["wrap", "wrap"],
    ["wrap", "balance"],
    ["wrap", "pretty"],
  ])("should apply the correct classes for %s variant with value %s", (variant, value) => {
    const props: Record<string, unknown> = { [variant]: value, as: "h1" as const };
    const { container } = renderWithProviders(<Header {...(props as any)}>Test</Header>);
    const el = container.querySelector("h1");
    if (!el) throw new Error("Expected heading element to be rendered");

    if (variant === "size") {
      expect(el).toHaveClass(sizeMap[value as string]);
    } else if (variant === "weight") {
      expect(el).toHaveClass(weightMap[value as string]);
    } else if (variant === "color") {
      expect(el).toHaveClass(colorMap[value as string]);
    } else if (variant === "align") {
      expect(el).toHaveClass(alignMap[value as string]);
    } else if (variant === "truncate") {
      if (value) expect(el).toHaveClass("truncate");
      else expect(el).not.toHaveClass("truncate");
    } else if (variant === "wrap") {
      expect(el).toHaveClass(wrapMap[value as string]);
    }
  });
});

describe("custom colors", () => {
  it("should apply custom color classes", () => {
    const { container } = renderWithProviders(<Header color="text-red-500">Test</Header>);
    expect(container.firstChild).toHaveClass("text-red-500");
  });

  it("should not apply built-in color classes when a custom color is provided", () => {
    const { container } = renderWithProviders(<Header color="text-red-500">Test</Header>);
    expect(container.firstChild).not.toHaveClass(headerVariants({ color: "primary" } as any));
  });
});

describe("element type", () => {
  it("should render an h1 by default", () => {
    const { container } = renderWithProviders(<Header>Test</Header>);
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("should render an h2 when as='h2'", () => {
    const { container } = renderWithProviders(<Header as="h2">Test</Header>);
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("should render an h3 when as='h3'", () => {
    const { container } = renderWithProviders(<Header as="h3">Test</Header>);
    expect(container.querySelector("h3")).toBeInTheDocument();
  });

  it("should render an h4 when as='h4'", () => {
    const { container } = renderWithProviders(<Header as="h4">Test</Header>);
    expect(container.querySelector("h4")).toBeInTheDocument();
  });

  it("should render an h5 when as='h5'", () => {
    const { container } = renderWithProviders(<Header as="h5">Test</Header>);
    expect(container.querySelector("h5")).toBeInTheDocument();
  });

  it("should render an h6 when as='h6'", () => {
    const { container } = renderWithProviders(<Header as="h6">Test</Header>);
    expect(container.querySelector("h6")).toBeInTheDocument();
  });
});

describe("ref forwarding", () => {
  it("forwards ref to h1 by default", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    renderWithProviders(<Header ref={ref}>Test</Header>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("H1");
  });

  it("forwards ref to h2 when as='h2'", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    renderWithProviders(
      <Header as="h2" ref={ref}>
        Test
      </Header>,
    );
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe("H2");
  });

  it("passes element-specific native props correctly", () => {
    const { container } = renderWithProviders(
      <Header as="h2" id="header-para" data-testid="header-element">
        Paragraph header
      </Header>,
    );
    const el = container.firstChild;
    expect(el).toHaveAttribute("id", "header-para");
    expect(el).toHaveAttribute("data-testid", "header-element");
  });
});

describe("accessibility", () => {
  it("should pass an axe accessibility audit", async () => {
    const { container } = renderWithProviders(
      <Header size="h2" weight="bold" color="primary" align="center" truncate wrap="balance">
        Accessibility Test Header
      </Header>,
    );
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });

  it("should auto-add title and aria-label when truncate is true and no label is provided", () => {
    const { getByText } = renderWithProviders(<Header truncate>Truncated Header</Header>);
    const el = getByText("Truncated Header");
    expect(el).toHaveAttribute("title", "Truncated Header");
    expect(el).toHaveAttribute("aria-label", "Truncated Header");
  });

  it("should respect provided title when truncate is true", () => {
    const { getByText } = renderWithProviders(
      <Header truncate title="Full header">
        Truncated Header
      </Header>,
    );
    const el = getByText("Truncated Header");
    expect(el).toHaveAttribute("title", "Full header");
  });
});
