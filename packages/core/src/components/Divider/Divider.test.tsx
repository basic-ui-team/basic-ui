import { describe, expect, it, vi } from "vitest";
import { Divider } from "./Divider";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";

describe("Divider - variants and behavior", () => {
  it.each(["horizontal", "vertical"] as const)(
    "keeps %s semantics scalar while thickness and inset change",
    (direction) => {
      const markup = renderToString(
        <Divider
          direction={direction}
          decorative={false}
          thickness={{ base: "thick", md: "none", lg: "thin" }}
          inset={{ base: 1, md: 3 }}
          appearance="dashed"
          color="green"
        />,
      );
      const axis = direction === "horizontal" ? "t" : "l";
      const margin = direction === "horizontal" ? "mx" : "my";
      expect(markup).toContain(`aria-orientation="${direction}"`);
      expect(markup).toContain(`border-${axis}-4`);
      expect(markup).toContain(`md:border-${axis}-0`);
      expect(markup).toContain(`lg:border-${axis}-1`);
      expect(markup).toContain(`${margin}-1`);
      expect(markup).toContain(`md:${margin}-3`);
      expect(markup).toContain("border-dashed");
      expect(markup).not.toContain("md:border-dashed");
      expect(markup).not.toContain("md:border-(--cr-border)");
    },
  );

  it.each([
    ["direction", "horizontal"],
    ["direction", "vertical"],
    ["thickness", "thin"],
    ["thickness", "medium"],
    ["thickness", "thick"],
    ["thickness", "none"],
    ["appearance", "solid"],
    ["appearance", "dashed"],
    ["appearance", "dotted"],
    ["color", "default"],
    ["color", "muted"],
  ])("should apply the correct classes for %s variant with value %s", (variant, value) => {
    const props = { [variant]: value } as any;
    const { container } = renderWithProviders(<Divider {...props} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();

    // Make assertions on the key classes instead of the entire CVA output to avoid
    // brittle comparisons with layout/box utility classes.
    if (variant === "direction") {
      if (value === "horizontal") {
        expect(el).toHaveClass("h-px");
      } else {
        expect(el).toHaveClass("w-px");
        expect(el).toHaveClass("h-full");
      }
    } else if (variant === "thickness") {
      // Thickness influences whether a border exists on the top/left axis.
      expect(el.className.includes("border-t") || el.className.includes("border-l")).toBe(true);
    } else if (variant === "appearance") {
      if (value === "solid") expect(el.className.includes("border-t")).toBe(true);
      if (value === "dashed") expect(el.className.includes("border-dashed")).toBe(true);
      if (value === "dotted") expect(el.className.includes("border-dotted")).toBe(true);
    } else if (variant === "color") {
      if (value === "default") expect(el.className.includes("border-border-base")).toBe(true);
      if (value === "muted") expect(el.className.includes("border-border-muted")).toBe(true);
    }
  });

  it("renders hr by default and is decorative (presentation)", () => {
    const { container } = renderWithProviders(<Divider />);
    const el = container.querySelector("hr") || container.firstChild;
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("role", "presentation");
    expect(el).not.toHaveAttribute("aria-orientation");
  });

  it("renders separator role when decorative=false", () => {
    const { container } = renderWithProviders(<Divider decorative={false} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "separator");
    expect(el).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders label and exposes semantic separator when label is provided", () => {
    const { getByText, container } = renderWithProviders(<Divider label="Section Break" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "separator");
    expect(getByText("Section Break")).toBeInTheDocument();
    expect(getByText("Section Break")).toHaveClass("bg-bg-base", "text-fg-muted");
  });

  it("warns when using a non-hr element for a semantic divider", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWithProviders(<Divider as="div" decorative={false} />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("passes an accessibility audit (decorative)", async () => {
    const { container } = renderWithProviders(<Divider />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("passes an accessibility audit (semantic with label)", async () => {
    const { container } = renderWithProviders(
      <div>
        <div>Before</div>
        <Divider label="Break" />
        <div>After</div>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

export {};
