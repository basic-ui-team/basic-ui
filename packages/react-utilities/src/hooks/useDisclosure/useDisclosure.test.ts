import { renderHookWithProviders } from "../../test-utils";
import { act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  it("defaults to closed when uncontrolled", () => {
    const { result } = renderHookWithProviders(() => useDisclosure());
    expect(result.current.open).toBe(false);
  });

  it("honors defaultOpen when uncontrolled", () => {
    const { result } = renderHookWithProviders(() => useDisclosure({ defaultOpen: true }));
    expect(result.current.open).toBe(true);
  });

  it("onOpen opens and fires onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHookWithProviders(() => useDisclosure({ onOpenChange }));
    act(() => result.current.onOpen());
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("onClose closes and fires onOpenChange", () => {
    const { result } = renderHookWithProviders(() =>
      useDisclosure({ defaultOpen: true, onOpenChange: undefined }),
    );
    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);
  });

  it("onOpen is idempotent — does not fire onOpenChange when already open", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useDisclosure({ defaultOpen: true, onOpenChange }),
    );
    act(() => result.current.onOpen());
    expect(result.current.open).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("onClose is idempotent — does not fire onOpenChange when already closed", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHookWithProviders(() => useDisclosure({ onOpenChange }));
    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("onToggle flips the state", () => {
    const { result } = renderHookWithProviders(() => useDisclosure());
    act(() => result.current.onToggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.onToggle());
    expect(result.current.open).toBe(false);
  });

  it("two rapid toggles before a re-render net to closed (no stale snapshot)", () => {
    const { result } = renderHookWithProviders(() => useDisclosure());
    act(() => {
      result.current.onToggle();
      result.current.onToggle();
    });
    expect(result.current.open).toBe(false);
  });

  it("three rapid toggles before a re-render end open", () => {
    const { result } = renderHookWithProviders(() => useDisclosure());
    act(() => {
      result.current.onToggle();
      result.current.onToggle();
      result.current.onToggle();
    });
    expect(result.current.open).toBe(true);
  });

  it("controlled mode mirrors the open prop and fires onOpenChange with next value", () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHookWithProviders(
      ({ open }: { open: boolean }) => useDisclosure({ open, onOpenChange }),
      { initialProps: { open: false } },
    );
    expect(result.current.open).toBe(false);
    act(() => result.current.onOpen());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Still mirrors the controlled prop until the parent updates it
    expect(result.current.open).toBe(false);
    rerender({ open: true });
    expect(result.current.open).toBe(true);
  });
});
