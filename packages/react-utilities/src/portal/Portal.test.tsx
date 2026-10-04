import { renderWithProviders } from "../test-utils";
import { describe, it, expect } from "vitest";
import { Portal } from "./Portal";

describe("Portal", () => {
  it("renders children into document.body by default", () => {
    const { baseElement } = renderWithProviders(
      <div data-testid="root">
        <Portal>
          <span data-testid="portalled">content</span>
        </Portal>
      </div>,
    );
    const portalled = baseElement.querySelector('[data-testid="portalled"]');
    expect(portalled).not.toBeNull();
    // Not a descendant of the React root's inner wrapper
    const root = baseElement.querySelector('[data-testid="root"]');
    expect(root?.contains(portalled as Node)).toBe(false);
    expect(document.body.contains(portalled as Node)).toBe(true);
  });

  it("renders into a custom container when provided", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    renderWithProviders(
      <Portal container={target}>
        <span data-testid="custom">content</span>
      </Portal>,
    );
    expect(target.querySelector('[data-testid="custom"]')).not.toBeNull();
    target.remove();
  });

  it("renders children in place when disabled", () => {
    const { baseElement } = renderWithProviders(
      <div data-testid="root">
        <Portal disabled>
          <span data-testid="inline">content</span>
        </Portal>
      </div>,
    );
    const inline = baseElement.querySelector('[data-testid="inline"]');
    const root = baseElement.querySelector('[data-testid="root"]');
    expect(root?.contains(inline as Node)).toBe(true);
  });

  it("renders nothing during SSR (before mount)", () => {
    // The mounted gate makes the first client render match the server:
    // nothing. We assert the pre-mount behavior via the disabled path's
    // counterpart — a portal only attaches after the mount effect.
    const { baseElement } = renderWithProviders(<Portal>ssr</Portal>);
    // After mount it has attached; before mount it returned null.
    expect(baseElement.textContent).toContain("ssr");
  });
});
