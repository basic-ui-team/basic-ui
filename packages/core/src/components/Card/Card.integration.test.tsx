import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser, fireEvent } from "../../test-utils";
import { axe } from "jest-axe";
import { Card } from "./index";
import { renderToString } from "react-dom/server";

describe("Card integration", () => {
  it("renders responsive CSS without viewport state or a responsive provider", () => {
    const markup = renderToString(
      <Card variant="outlined">
        <Card.Header variant={{ base: "compact", md: "default" }}>
          <Card.Title size={{ base: "h4", lg: "h1" }}>Title</Card.Title>
        </Card.Header>
        <Card.Body variant={{ base: "default", lg: "compact" }}>Body</Card.Body>
        <Card.Footer sticky variant={{ base: "compact", xl: "default" }}>Footer</Card.Footer>
      </Card>,
    );
    expect(markup).toContain("md:p-3");
    expect(markup).toContain("lg:text-3xl");
    expect(markup).toContain("lg:p-2");
    expect(markup).toContain("xl:p-3");
    expect(markup).not.toMatch(/(?:md|lg|xl):(?:sticky|opacity|bg-|font-)/);
  });

  it("keeps section state and footer stickiness scalar", () => {
    const { container } = renderWithProviders(
      <Card disabled>
        <Card.Header variant={{ base: "compact", md: "default" }} />
        <Card.Body variant={{ base: "compact", lg: "default" }} />
        <Card.Footer sticky variant={{ base: "compact", xl: "default" }} />
      </Card>,
    );
    const [header, body, footer] = [...container.firstElementChild!.children];
    expect(header).toHaveClass("p-2", "md:p-3", "opacity-50");
    expect(body).toHaveClass("p-2", "lg:p-3", "opacity-50");
    expect(footer).toHaveClass("p-2", "xl:p-3", "sticky", "bottom-0", "opacity-50");
    expect(footer.className.split(/\s+/).filter((name) => name.startsWith("xl:"))).toEqual(["xl:p-3"]);
  });

  describe.each(["Title", "Description"] as const)("%s responsive flow", (part) => {
    it("restores wrapping and overflow after truncation, with stable accessibility", () => {
      const Component = Card[part];
      const { container } = renderWithProviders(
        <Component
          truncate={{ base: true, md: false, xl: true }}
          wrap={{ base: "nowrap", sm: "balance", lg: "pretty" }}
          overflow={{ base: "auto", sm: "scroll" }}
          align={{ base: "left", lg: "right" }}
          weight="bold"
          color="green"
        >
          Full text
        </Component>,
      );
      const element = container.firstElementChild!;
      expect(element).toHaveClass(
        "overflow-hidden", "text-ellipsis", "whitespace-nowrap",
        "md:overflow-scroll", "md:text-clip", "md:whitespace-normal", "md:text-balance",
        "lg:text-pretty", "lg:text-right",
        "xl:overflow-hidden", "xl:text-ellipsis", "xl:whitespace-nowrap",
        "font-bold", "text-(color:--cr-text)",
      );
      expect(element).toHaveAttribute("title", "Full text");
      expect(element).toHaveAttribute("aria-label", "Full text");
      expect(element).not.toHaveClass("lg:font-bold", "lg:text-(color:--cr-text)");
      expect(element).not.toHaveAttribute("truncate");
    });

    it("provides stable full-text attributes even when truncation starts at a later breakpoint", () => {
      const Component = Card[part];
      const { container } = renderWithProviders(
        <Component truncate={{ base: false, md: true }}>Full text</Component>,
      );
      const element = container.firstElementChild!;
      expect(element).toHaveAttribute("title", "Full text");
      expect(element).toHaveAttribute("aria-label", "Full text");
      expect(element).toHaveClass("md:overflow-hidden", "md:whitespace-nowrap", "md:text-ellipsis");
    });

    it("preserves explicit accessibility attributes and class overrides", () => {
      const Component = Card[part];
      const { container } = renderWithProviders(
        <Component
          truncate={{ base: true, md: false }}
          title="Custom title"
          aria-label="Custom label"
          className="md:overflow-auto"
        >
          Full text
        </Component>,
      );
      expect(container.firstElementChild).toHaveAttribute("title", "Custom title");
      expect(container.firstElementChild).toHaveAttribute("aria-label", "Custom label");
      expect(container.firstElementChild).toHaveClass("md:overflow-auto");
      expect(container.firstElementChild).not.toHaveClass("md:overflow-visible");
    });
  });

  it("composes all parts and supports interactions", async () => {
    const user = setupUser();
    const handle = vi.fn();

    const { container } = renderWithProviders(
      <Card interaction="both" variant="elevated" onClick={handle}>
        <Card.Image src="/img.png" alt="img" />
        <Card.Header>
          <Card.Title>My title</Card.Title>
          <Card.Description>Desc</Card.Description>
        </Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer sticky>Footer</Card.Footer>
      </Card>,
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeInTheDocument();
    // interaction 'both' yields role=button and draggable
    expect(root).toHaveAttribute("role", "button");
    expect(root).toHaveAttribute("draggable", "true");

    const img = screen.getByAltText("img");
    expect(img).toHaveClass("object-cover");

    const header = container.querySelector("header");
    expect(header).toHaveClass("p-3");

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("sticky");
    expect(footer).toHaveClass("z-sticky");

    // keyboard activation
    root.focus();
    fireEvent.keyDown(root, { key: "Enter", code: "Enter", charCode: 13 });
    expect(handle).toHaveBeenCalledTimes(1);

    // click activation
    await user.click(root);
    expect(handle).toHaveBeenCalledTimes(2);

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
