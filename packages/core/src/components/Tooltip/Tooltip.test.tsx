import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { act, fireEvent } from "@testing-library/react";
import { renderWithProviders, screen } from "../../test-utils";
import { Tooltip } from "./Tooltip";

// React maps onPointerEnter/Leave onto the bubbling pointerover/out events,
// so the enter/leave simulation must fire those (see react-dom's delegation).
function hover(element: Element) {
  fireEvent.pointerOver(element);
}
function unhover(element: Element) {
  fireEvent.pointerOut(element);
}
// Portal content attaches a commit after the first render, so
// useAnchorPositioning retries on the next animation frame; flush it.
function flushFrame() {
  vi.advanceTimersByTime(50);
}

describe("Tooltip", () => {
  it("does not render the panel before the trigger is hovered", () => {
    renderWithProviders(
      <Tooltip label="Helpful hint">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens after the default delay on hover and wires aria-describedby", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Helpful hint">
          <button>Hover me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Hover me" });
      expect(trigger).not.toHaveAttribute("aria-describedby");
      act(() => {
        hover(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(399);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      act(() => {
        flushFrame();
      });
      const tooltip = screen.getByRole("tooltip");
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
      expect(tooltip).toHaveTextContent("Helpful hint");
    } finally {
      vi.useRealTimers();
    }
  });

  it("opens after the delay on keyboard focus", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Helpful hint">
          <button>Focus me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Focus me" });
      act(() => {
        fireEvent.focus(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      act(() => {
        flushFrame();
      });
      const tooltip = screen.getByRole("tooltip");
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes after closeDelay when the pointer leaves the trigger", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Helpful hint" delay={0} closeDelay={100}>
          <button>Hover me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Hover me" });
      act(() => {
        hover(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      act(() => {
        flushFrame();
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      act(() => {
        unhover(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      expect(trigger).not.toHaveAttribute("aria-describedby");
    } finally {
      vi.useRealTimers();
    }
  });

  it("stays open while hovering the tooltip panel", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Keep reading" delay={0} closeDelay={100}>
          <button>Hover me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Hover me" });
      act(() => {
        hover(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      act(() => {
        flushFrame();
      });
      const tooltip = screen.getByRole("tooltip");
      // Move from the trigger onto the panel before the close delay fires.
      act(() => {
        unhover(trigger);
        hover(tooltip);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      act(() => {
        unhover(tooltip);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("supports a custom delay", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Slow tooltip" delay={600}>
          <button>Hover me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Hover me" });
      act(() => {
        hover(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(599);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      act(() => {
        flushFrame();
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("never opens when disabled and leaves the trigger unwired", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Hidden" disabled>
          <button>Disabled tooltip</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button", { name: "Disabled tooltip" });
      act(() => {
        hover(trigger);
        fireEvent.focus(trigger);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      expect(trigger).not.toHaveAttribute("aria-describedby");
    } finally {
      vi.useRealTimers();
    }
  });

  it("is axe-clean when open on hover", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      const view = renderWithProviders(
        <Tooltip label="Accessible hint" delay={0}>
          <button>Hover me</button>
        </Tooltip>,
      );
      act(() => {
        hover(screen.getByRole("button", { name: "Hover me" }));
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      act(() => {
        flushFrame();
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      vi.useRealTimers();
      expect(await axe(view.baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    } finally {
      vi.useRealTimers();
    }
  });

  it("is axe-clean when open via keyboard focus", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      const view = renderWithProviders(
        <Tooltip label="Accessible hint" delay={0}>
          <button>Focus me</button>
        </Tooltip>,
      );
      act(() => {
        fireEvent.focus(screen.getByRole("button", { name: "Focus me" }));
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      act(() => {
        flushFrame();
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      vi.useRealTimers();
      expect(await axe(view.baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders the label content inside the portalled panel", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
    try {
      renderWithProviders(
        <Tooltip label="Helpful hint" delay={0}>
          <button>Hover me</button>
        </Tooltip>,
      );
      act(() => {
        hover(screen.getByRole("button", { name: "Hover me" }));
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      act(() => {
        flushFrame();
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Helpful hint");
    } finally {
      vi.useRealTimers();
    }
  });
});
