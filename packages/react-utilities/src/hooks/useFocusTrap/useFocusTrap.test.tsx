import { renderWithProviders, setupUser, screen } from "../../test-utils";
import { describe, it, expect } from "vitest";
import * as React from "react";
import { useFocusTrap } from "./useFocusTrap";

function Fixture({ enabled, initialFocusRef }: { enabled: boolean; initialFocusRef?: React.RefObject<HTMLButtonElement | null> }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useFocusTrap({ ref, enabled, initialFocusRef });
  return (
    <div>
      <button data-testid="outside-before">outside before</button>
      <div ref={ref} data-testid="trap">
        <button data-testid="first">first</button>
        <button data-testid="middle">middle</button>
        <button data-testid="last">last</button>
      </div>
      <button data-testid="outside-after">outside after</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus into the container on activation", async () => {
    const { getByTestId } = renderWithProviders(<Fixture enabled />);
    expect(getByTestId("first")).toHaveFocus();
  });

  it("honors initialFocusRef", () => {
    function FixtureWithInitialFocus() {
      const ref = React.useRef<HTMLDivElement>(null);
      const initialFocusRef = React.useRef<HTMLButtonElement>(null);
      useFocusTrap({ ref, enabled: true, initialFocusRef });
      return (
        <div ref={ref}>
          <button data-testid="first">first</button>
          <button ref={initialFocusRef} data-testid="target">target</button>
        </div>
      );
    }
    renderWithProviders(<FixtureWithInitialFocus />);
    expect(screen.getByTestId("target")).toHaveFocus();
  });

  it("Tab cycles from last back to first", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<Fixture enabled />);
    await user.tab();
    expect(getByTestId("middle")).toHaveFocus();
    await user.tab();
    expect(getByTestId("last")).toHaveFocus();
    await user.tab();
    expect(getByTestId("first")).toHaveFocus();
  });

  it("Shift+Tab cycles from first back to last", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<Fixture enabled />);
    await user.tab({ shift: true });
    expect(getByTestId("last")).toHaveFocus();
  });

  it("marks sibling subtrees aria-hidden while active and removes on deactivate", () => {
    const { rerender, baseElement } = renderWithProviders(<Fixture enabled />);
    // Storybook/test root wrapper is a sibling of the trap's ancestors at body level;
    // the trap's own subtree stays visible.
    const trap = baseElement.querySelector('[data-testid="trap"]');
    expect(trap?.getAttribute("aria-hidden")).toBeNull();

    rerender(<Fixture enabled={false} />);
    // All aria-hidden marks we added are removed
    const stillHidden = Array.from(baseElement.querySelectorAll('[aria-hidden="true"]'));
    expect(stillHidden.length).toBe(0);
  });

  it("restores focus to the previously focused element on deactivate", () => {
    const outside = React.createRef<HTMLButtonElement>();
    function Fixture2({ enabled }: { enabled: boolean }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useFocusTrap({ ref, enabled });
      return (
        <div>
          <button ref={outside} data-testid="opener" onClick={() => {}}>
            opener
          </button>
          <div ref={ref}>
            <button>inside</button>
          </div>
        </div>
      );
    }
    const { rerender } = renderWithProviders(<Fixture2 enabled={false} />);
    outside.current?.focus();
    rerender(<Fixture2 enabled />);
    rerender(<Fixture2 enabled={false} />);
    expect(outside.current).toHaveFocus();
  });
});
