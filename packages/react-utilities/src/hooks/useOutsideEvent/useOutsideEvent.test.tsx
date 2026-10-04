import { renderWithProviders, renderHookWithProviders, setupUser } from "../../test-utils";
import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { useOutsideEvent } from "./useOutsideEvent";

describe("useOutsideEvent", () => {
  it("fires onOutsidePointerDown for pointerdown outside the element", async () => {
    const user = setupUser();
    const onOutsidePointerDown = vi.fn();
    const onEscape = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onOutsidePointerDown, onEscape });
      return (
        <div>
          <div ref={ref} data-testid="inside">
            inside
          </div>
          <button data-testid="outside">outside</button>
        </div>
      );
    }

    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("outside"));
    expect(onOutsidePointerDown).toHaveBeenCalledTimes(1);
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("does not fire for pointerdown inside the element", async () => {
    const user = setupUser();
    const onOutsidePointerDown = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onOutsidePointerDown });
      return <div ref={ref} data-testid="inside">inside</div>;
    }

    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("inside"));
    expect(onOutsidePointerDown).not.toHaveBeenCalled();
  });

  it("fires onEscape on Escape keydown", async () => {
    const user = setupUser();
    const onEscape = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onEscape });
      return <div ref={ref}>inside</div>;
    }

    renderWithProviders(<Fixture />);
    await user.keyboard("{Escape}");
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("does not attach listeners when disabled", async () => {
    const user = setupUser();
    const onOutsidePointerDown = vi.fn();
    const onEscape = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onOutsidePointerDown, onEscape, enabled: false });
      return (
        <div>
          <div ref={ref}>inside</div>
          <button data-testid="outside">outside</button>
        </div>
      );
    }

    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("outside"));
    await user.keyboard("{Escape}");
    expect(onOutsidePointerDown).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("fires onEscape once per Escape even with multiple enabled instances", async () => {
    const user = setupUser();
    const first = vi.fn();
    const second = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      const ref2 = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onEscape: first });
      useOutsideEvent({ ref: ref2, onEscape: second });
      return (
        <div>
          <div ref={ref} />
          <div ref={ref2} />
        </div>
      );
    }

    renderWithProviders(<Fixture />);
    await user.keyboard("{Escape}");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("fires onOutsidePointerDown even when the outside target stops propagation", async () => {
    const user = setupUser();
    const onOutsidePointerDown = vi.fn();

    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onOutsidePointerDown });
      return (
        <div>
          <div ref={ref} data-testid="inside">
            inside
          </div>
          <button
            data-testid="outside"
            onPointerDown={(e) => e.nativeEvent.stopPropagation()}
          >
            outside
          </button>
        </div>
      );
    }

    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("outside"));
    expect(onOutsidePointerDown).toHaveBeenCalledTimes(1);
  });

  it("works with renderHook for logic-only usage", () => {
    const onEscape = vi.fn();
    const { result } = renderHookWithProviders(() => {
      const ref = React.useRef<HTMLDivElement>(null);
      useOutsideEvent({ ref, onEscape });
      return ref;
    });
    expect(result.current).toBeDefined();
  });
});
