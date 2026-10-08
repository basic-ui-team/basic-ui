import { renderHookWithProviders } from "../../test-utils";
import { act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as React from "react";
import { useTooltip } from "./useTooltip";
import { resetOverlayStackForTesting } from "../useOverlay/useOverlay";

describe("useTooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetOverlayStackForTesting();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetOverlayStackForTesting();
  });

  it("initializes with open = false", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    expect(result.current.open).toBe(false);
  });

  it("returns tooltipProps with role = 'tooltip'", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    expect(result.current.tooltipProps.role).toBe("tooltip");
  });

  it("returns triggerProps with event handlers", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    expect(result.current.triggerProps.onPointerEnter).toBeDefined();
    expect(result.current.triggerProps.onPointerLeave).toBeDefined();
    expect(result.current.triggerProps.onFocus).toBeDefined();
    expect(result.current.triggerProps.onBlur).toBeDefined();
  });

  it("returns tooltipProps with event handlers", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    expect(result.current.tooltipProps.onPointerEnter).toBeDefined();
    expect(result.current.tooltipProps.onPointerLeave).toBeDefined();
  });

  it("aria-describedby is undefined when tooltip is closed", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    expect(result.current.triggerProps["aria-describedby"]).toBeUndefined();
  });

  it("schedules open after delay on pointer enter", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 100 });
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    expect(result.current.open).toBe(true);
  });

  it("schedules close after closeDelay on pointer leave", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 10, closeDelay: 100, defaultOpen: true });
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    expect(result.current.open).toBe(false);
  });

  it("schedules open after delay on focus", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 100 });
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      result.current.triggerProps.onFocus?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.open).toBe(true);
  });

  it("schedules close after closeDelay on blur", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 10, closeDelay: 100, defaultOpen: true });
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      result.current.triggerProps.onBlur?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.open).toBe(false);
  });

  it("clears open timer when pointer leaves before delay completes", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 100 });
    });
    
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    // Clear the timer by triggering pointer leave - this should close immediately
    // because we only have hover state (no focus)
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    // Advance time past the close delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Tooltip should still be closed because the timer was cleared and close was scheduled
    expect(result.current.open).toBe(false);
  });

  it("clears close timer when pointer enters tooltip", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 10, closeDelay: 100, defaultOpen: true });
    });
    
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    // Clear the close timer by entering the tooltip
    act(() => {
      result.current.tooltipProps.onPointerEnter?.({} as React.PointerEvent<HTMLDivElement>);
    });
    
    // Advance time past the original close delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Tooltip should still be open because the close timer was cleared
    expect(result.current.open).toBe(true);
  });

  it("schedules close after closeDelay when pointer leaves tooltip", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 10, closeDelay: 100, defaultOpen: true });
    });
    
    act(() => {
      result.current.tooltipProps.onPointerLeave?.({} as React.PointerEvent<HTMLDivElement>);
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.open).toBe(false);
  });

  it("aria-describedby references tooltip id when open", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 0 });
    });

    expect(result.current.triggerProps["aria-describedby"]).toBeUndefined();

    // Simulate immediate opening
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });

    // Since delay is 0, it should open immediately after the timer
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.triggerProps["aria-describedby"]).toBe(result.current.tooltipProps.id);
  });

  it("uses custom delay values", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 200 });
    });
    
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    act(() => {
      vi.advanceTimersByTime(199);
    });
    
    expect(result.current.open).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(1);
    });
    
    expect(result.current.open).toBe(true);
  });

  it("uses custom closeDelay values", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 10, closeDelay: 200, defaultOpen: true });
    });
    
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    act(() => {
      vi.advanceTimersByTime(199);
    });
    
    expect(result.current.open).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(1);
    });
    
    expect(result.current.open).toBe(false);
  });

  it("passes positioning props to usePopover", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({
        anchorRef,
        side: "top",
        align: "start",
        sideOffset: 16,
      });
    });

    // The tooltipProps.style should be computed by usePopover with our positioning
    expect(result.current.tooltipProps.style).toBeDefined();
  });

  it("handles controlled open state", () => {
    const { result, rerender } = renderHookWithProviders(
      ({ open }: { open: boolean }) => {
        const anchorRef = React.useRef<HTMLButtonElement>(null);
        return useTooltip({ anchorRef, open });
      },
      { initialProps: { open: false } },
    );

    expect(result.current.open).toBe(false);

    rerender({ open: true });
    expect(result.current.open).toBe(true);

    rerender({ open: false });
    expect(result.current.open).toBe(false);
  });

  it("calls onOpenChange when state changes", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, onOpenChange, delay: 0, closeDelay: 0 });
    });

    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Reset and test closing - need to remove both hover and focus to trigger close
    onOpenChange.mockClear();
    
    // First remove pointer (hover)
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    // Then remove focus
    act(() => {
      result.current.triggerProps.onBlur?.({} as React.FocusEvent<HTMLButtonElement>);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uses default values for delay and closeDelay", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });
    
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    
    // Should not open before default delay (400ms)
    act(() => {
      vi.advanceTimersByTime(399);
    });
    
    expect(result.current.open).toBe(false);
    
    // Should open after default delay (400ms)
    act(() => {
      vi.advanceTimersByTime(1);
    });
    
    expect(result.current.open).toBe(true);
  });

  it("initializes with defaultOpen = true", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, defaultOpen: true });
    });
    expect(result.current.open).toBe(true);
  });

  it("tooltipProps has a unique id", () => {
    const { result: result1 } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });

    const { result: result2 } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef });
    });

    expect(result1.current.tooltipProps.id).toBeDefined();
    expect(result2.current.tooltipProps.id).toBeDefined();
    expect(result1.current.tooltipProps.id).not.toBe(result2.current.tooltipProps.id);
  });

  it("cleans up timers on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    
    const { result, unmount } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 100 });
    });

    // Schedule an open
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });

    // Unmount the hook
    unmount();

    // clearTimeout should have been called to clean up the pending timer
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("handles multiple rapid pointer enter/leave events", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 100, closeDelay: 50 });
    });

    // Rapid enter/leave sequence
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
      vi.advanceTimersByTime(25);
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
      vi.advanceTimersByTime(25);
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
      vi.advanceTimersByTime(25);
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
      vi.advanceTimersByTime(25);
    });

    // Should still be closed since the last action was a leave
    expect(result.current.open).toBe(false);

    // Advance past close delay
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.open).toBe(false);
  });

  it("stays open when focused even if pointer leaves trigger", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 0, closeDelay: 100 });
    });

    // Open via focus
    act(() => {
      result.current.triggerProps.onFocus?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.open).toBe(true);

    // Pointer leaves - should NOT close because focus remains
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Should still be open because focus is maintained
    expect(result.current.open).toBe(true);

    // Now lose focus - should schedule close
    act(() => {
      result.current.triggerProps.onBlur?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Should be closed now that both pointer and focus are gone
    expect(result.current.open).toBe(false);
  });

  it("stays open when hovered even if focus leaves trigger", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 0, closeDelay: 100 });
    });

    // Open via pointer
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.open).toBe(true);

    // Focus leaves - should NOT close because hover remains
    act(() => {
      result.current.triggerProps.onBlur?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Should still be open because hover is maintained
    expect(result.current.open).toBe(true);

    // Now pointer leaves - should schedule close
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Should be closed now that both pointer and focus are gone
    expect(result.current.open).toBe(false);
  });

  it("closes only when both pointer and focus are inactive", () => {
    const { result } = renderHookWithProviders(() => {
      const anchorRef = React.useRef<HTMLButtonElement>(null);
      return useTooltip({ anchorRef, delay: 0, closeDelay: 100 });
    });

    // Open via both pointer and focus
    act(() => {
      result.current.triggerProps.onPointerEnter?.({} as React.PointerEvent<HTMLButtonElement>);
      result.current.triggerProps.onFocus?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.open).toBe(true);

    // Pointer leaves - still open because focus remains
    act(() => {
      result.current.triggerProps.onPointerLeave?.({} as React.PointerEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.open).toBe(true);

    // Focus leaves - now both pointer and focus are gone, should close
    act(() => {
      result.current.triggerProps.onBlur?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.open).toBe(false);
  });
});