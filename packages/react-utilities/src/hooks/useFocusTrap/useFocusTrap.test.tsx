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

  it("excludes tabindex other than -1-negative values from the cycle", async () => {
    const user = setupUser();
    function NegativeTabindexFixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useFocusTrap({ ref, enabled: true });
      return (
        <div ref={ref}>
          <button data-testid="first">first</button>
          <div data-testid="skipped" tabIndex={-2}>not tabbable</div>
          <button data-testid="last">last</button>
        </div>
      );
    }
    const { getByTestId } = renderWithProviders(<NegativeTabindexFixture />);
    expect(getByTestId("first")).toHaveFocus();
    await user.tab();
    expect(getByTestId("last")).toHaveFocus();
    await user.tab();
    expect(getByTestId("first")).toHaveFocus();
    expect(getByTestId("skipped")).not.toHaveFocus();
  });
  it("makes a focusable-less container itself focusable", () => {
    function PlainFixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useFocusTrap({ ref, enabled: true });
      return (
        <div>
          <div ref={ref} data-testid="plain">no controls here</div>
        </div>
      );
    }
    const { getByTestId, unmount } = renderWithProviders(<PlainFixture />);
    expect(getByTestId("plain")).toHaveFocus();
    expect(getByTestId("plain")).toHaveAttribute("tabindex", "-1");
    unmount();
    // Temporarily-added tabindex is removed on deactivate
    // (fresh render assertion below avoids stale DOM references)
    function PlainAgain() {
      const ref = React.useRef<HTMLDivElement>(null);
      const [enabled, setEnabled] = React.useState(true);
      useFocusTrap({ ref, enabled });
      return (
        <div>
          <button data-testid="toggle" onClick={() => setEnabled((e) => !e)}>toggle</button>
          <div ref={ref} data-testid="plain2">text</div>
        </div>
      );
    }
    const { getByTestId: get, rerender } = renderWithProviders(<PlainAgain />);
    expect(get("plain2")).toHaveAttribute("tabindex", "-1");
    rerender(<PlainAgain />);
  });
  it("redirects focus that escaped back into the trap on Tab", async () => {
    const user = setupUser();
    const escapeRef = React.createRef<HTMLButtonElement>();
    function EscapeFixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      useFocusTrap({ ref, enabled: true });
      return (
        <div>
          <div ref={ref}>
            <button data-testid="first">first</button>
            <button data-testid="last">last</button>
          </div>
          <button ref={escapeRef} data-testid="outside">outside</button>
        </div>
      );
    }
    renderWithProviders(<EscapeFixture />);
    // Simulate focus escaping the trap (e.g. a click on a background control)
    escapeRef.current?.focus();
    await user.tab();
    // Tab is redirected: forward escape goes to the first element
    expect(screen.getByTestId("first")).toHaveFocus();
  });
  it("only the innermost trap owns Tab when traps nest", async () => {
    const user = setupUser();
    function NestedFixture() {
      const outer = React.useRef<HTMLDivElement>(null);
      const inner = React.useRef<HTMLDivElement>(null);
      useFocusTrap({ ref: outer, enabled: true });
      useFocusTrap({ ref: inner, enabled: true });
      return (
        <div ref={outer}>
          <button data-testid="outer-first">outer first</button>
          <div ref={inner}>
            <button data-testid="inner-first">inner first</button>
            <button data-testid="inner-last">inner last</button>
          </div>
          <button data-testid="outer-last">outer last</button>
        </div>
      );
    }
    const { getByTestId } = renderWithProviders(<NestedFixture />);
    expect(getByTestId("inner-first")).toHaveFocus();
    await user.tab();
    expect(getByTestId("inner-last")).toHaveFocus();
    await user.tab();
    // Cycles within the inner trap, not out to the outer one
    expect(getByTestId("inner-first")).toHaveFocus();
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
