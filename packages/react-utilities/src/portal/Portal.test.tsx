import { renderWithProviders } from "../test-utils";
import { describe, it, expect } from "vitest";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act } from "react";
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

  it("emits no portal markup on the server and hydrates without mismatch", async () => {
    // Server render: the portal must contribute nothing, so the first client
    // render (pre-effect) matches the server output exactly.
    const serverHtml = renderToString(
      <div>
        <Portal>portalled-content</Portal>
        <span>inline-content</span>
      </div>,
    );
    expect(serverHtml).not.toContain("portalled-content");
    expect(serverHtml).toContain("inline-content");

    // Hydrate that exact markup: the mount effect then attaches the portal.
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = serverHtml;
    let root: ReturnType<typeof hydrateRoot> | null = null;
    await act(async () => {
      root = hydrateRoot(
        container,
        <div>
          <Portal>portalled-content</Portal>
          <span>inline-content</span>
        </div>,
      );
    });
    expect(container.querySelector("span")?.textContent).toBe("inline-content");
    // The portal attaches to document.body after mount, not the container
    expect(document.body.textContent).toContain("portalled-content");
    await act(async () => {
      root?.unmount();
    });
    container.remove();
  });
});
