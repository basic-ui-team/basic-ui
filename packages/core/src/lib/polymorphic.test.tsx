import React from "react";
import type { ElementType } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { forwardRefWithAs } from "./polymorphic";

describe("forwardRefWithAs", () => {
  it("forwards ref to default element and renders children", () => {
    function Impl(props: any, ref: any): React.ReactElement | null {
      const Comp = (props as any).as || "div";
      const { as, children, ...rest } = props as any;
      return (
        <Comp ref={ref} data-testid="el" {...rest}>
          {children}
        </Comp>
      );
    }

    const Comp = forwardRefWithAs<any, ElementType>(Impl as any);
    const ref = React.createRef<HTMLDivElement>();
    render(<Comp ref={ref}>Hello</Comp>);

    const el = screen.getByTestId("el");
    expect(el.textContent).toBe("Hello");
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect((ref.current as HTMLElement).tagName.toLowerCase()).toBe("div");
  });

  it("renders as anchor when as='a' and forwards ref/props", () => {
    function Impl(props: any, ref: any): React.ReactElement | null {
      const Comp = (props as any).as || "div";
      const { as, children, ...rest } = props as any;
      return (
        <Comp ref={ref} data-testid="el" {...rest}>
          {children}
        </Comp>
      );
    }

    const Comp = forwardRefWithAs<any, ElementType>(Impl as any);
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Comp as="a" ref={ref} href="/test">
        Click
      </Comp>,
    );

    const el = screen.getByTestId("el") as HTMLAnchorElement;
    expect(el.tagName.toLowerCase()).toBe("a");
    expect(el.getAttribute("href")).toBe("/test");
    expect(ref.current).toBe(el);
  });

  it("forwards className and arbitrary props", () => {
    function Impl(props: any, ref: any): React.ReactElement | null {
      const Comp = (props as any).as || "div";
      const { as, children, ...rest } = props as any;
      return (
        <Comp ref={ref} data-testid="el" {...rest}>
          {children}
        </Comp>
      );
    }

    const Comp = forwardRefWithAs<any, ElementType>(Impl as any);
    render(
      <Comp className="foo" data-custom="bar">
        X
      </Comp>,
    );

    const el = screen.getByTestId("el");
    expect(el).toHaveClass("foo");
    expect(el.getAttribute("data-custom")).toBe("bar");
  });
});
