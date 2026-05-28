import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, setupUser, fireEvent } from "../../test-utils";
import { axe } from "jest-axe";
import { Card } from "./index";

describe("Card integration", () => {
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
    expect(header).toHaveClass("p-md");

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("sticky");

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
