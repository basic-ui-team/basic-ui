import React from "react";
import { describe, expect, it } from "vitest";
import { headerVariants } from "./header.variants";
import { Header } from "./Header";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";

describe("variants", () => {
  const sizeMap: Record<string, string> = {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-xl",
    h4: "text-lg",
    h5: "text-md",
    h6: "text-sm",
  };

  const weightMap: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorMap: Record<string, string> = {
    default: "text-fg-base",
    muted: "text-fg-muted",
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
    ["color", "muted"],
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
    let element: React.ReactElement;

    switch (variant) {
      case "size":
        element = <Header as="h1" size={value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}>Test</Header>;
        break;
      case "weight":
        element = <Header as="h1" weight={value as "normal" | "medium" | "semibold" | "bold"}>Test</Header>;
        break;
      case "color":
        element = <Header as="h1" color={value as "default" | "muted"}>Test</Header>;
        break;
      case "align":
        element = <Header as="h1" align={value as "left" | "center" | "right"}>Test</Header>;
        break;
      case "truncate":
        element = <Header as="h1" truncate={value as boolean}>Test</Header>;
        break;
      case "wrap":
        element = <Header as="h1" wrap={value as "nowrap" | "wrap" | "balance" | "pretty"}>Test</Header>;
        break;
      default:
        element = <Header as="h1">Test</Header>;
    }

    const { container } = renderWithProviders(element);
    const el = container.querySelector("h1");
    if (!el) throw new Error("Expected heading element to be rendered");

    if (variant === "size") {
      expect(el).toHaveClass(sizeMap[String(value)]);
    } else if (variant === "weight") {
      expect(el).toHaveClass(weightMap[String(value)]);
    } else if (variant === "color") {
      expect(el).toHaveClass(colorMap[String(value)]);
    } else if (variant === "align") {
      expect(el).toHaveClass(alignMap[String(value)]);
    } else if (variant === "truncate") {
      if (value) expect(el).toHaveClass("overflow-hidden");
      else expect(el).not.toHaveClass("overflow-hidden");
    } else if (variant === "wrap") {
      expect(el).toHaveClass(wrapMap[String(value)]);
    }
  });
});

describe("responsive CSS", () => {
  it("renders independent responsive axes without viewport state", () => {
    const markup = renderToString(
      <Header
        as="h3"
        size={{ base: "h6", lg: "h1" }}
        align={{ base: "left", md: "right" }}
        color="green"
        weight="bold"
      >
        Heading
      </Header>,
    );
    expect(markup).toContain("<h3");
    expect(markup).toContain("text-sm");
    expect(markup).toContain("lg:text-3xl");
    expect(markup).toContain("md:text-right");
    expect(markup).toContain("text-(color:--cr-text)");
    expect(markup).not.toMatch(/(?:md|lg):(?:font-|text-fg-|leading-)/);
  });

  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
    "does not automatically scale a scalar %s size",
    (size) => {
      const { container } = renderWithProviders(<Header size={size}>Heading</Header>);
      expect(container.firstElementChild?.className).not.toMatch(/(?:^|\s)(?:md|lg):/);
    },
  );

  it("restores flow after truncation and keeps full-text attributes stable", () => {
    const { container } = renderWithProviders(
      <Header
        truncate={{ base: false, sm: true, lg: false }}
        wrap={{ base: "nowrap", md: "balance" }}
        overflow="auto"
      >
        Full heading
      </Header>,
    );
    const heading = container.firstElementChild!;
    expect(heading).toHaveClass(
      "overflow-auto", "text-clip", "text-nowrap",
      "sm:overflow-hidden", "sm:text-ellipsis", "sm:whitespace-nowrap",
      "md:overflow-hidden", "md:whitespace-nowrap",
      "lg:overflow-auto", "lg:text-clip", "lg:whitespace-normal", "lg:text-balance",
    );
    expect(heading).toHaveAttribute("title", "Full heading");
    expect(heading).toHaveAttribute("aria-label", "Full heading");
  });

  it("preserves explicit accessibility attributes and consumer overrides", () => {
    const { container } = renderWithProviders(
      <Header
        truncate={{ base: true, md: false }}
        size={{ base: "h6", md: "h1" }}
        title="Custom title"
        aria-label="Custom label"
        className="md:text-lg md:overflow-scroll"
      >
        Heading
      </Header>,
    );
    const heading = container.firstElementChild!;
    expect(heading).toHaveClass("md:text-lg", "md:overflow-scroll");
    expect(heading).not.toHaveClass("md:text-3xl", "md:overflow-visible");
    expect(heading).toHaveAttribute("title", "Custom title");
    expect(heading).toHaveAttribute("aria-label", "Custom label");
  });
});

describe("palette colors", () => {
  it("should apply palette recipe utilities and variables", () => {
    const { container } = renderWithProviders(<Header color="teal">Test</Header>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("text-(color:--cr-text)");
    expect(header.getAttribute("style")).toContain("--cr-text: var(--color-teal-700)");
    expect(header.getAttribute("style")).toContain("--cr-text-dark: var(--color-teal-300)");
  });

  it("should not apply structural color classes when a palette color is provided", () => {
    const { container } = renderWithProviders(<Header color="teal">Test</Header>);
    expect(container.firstChild).not.toHaveClass(headerVariants({ color: "default" }));
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
