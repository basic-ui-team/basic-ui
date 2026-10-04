import { renderHookWithProviders } from "../../test-utils";
import { act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  let consoleWarn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarn.mockRestore();
  });

  it("uses defaultValue when uncontrolled", () => {
    const { result } = renderHookWithProviders(() =>
      useControllableState({ defaultValue: "initial" }),
    );
    expect(result.current[0]).toBe("initial");
  });

  it("returns undefined when uncontrolled with no defaultValue", () => {
    const { result } = renderHookWithProviders(() => useControllableState({}));
    expect(result.current[0]).toBeUndefined();
  });

  it("controlled value wins over defaultValue and internal state", () => {
    const { result, rerender } = renderHookWithProviders(
      ({ value }: { value: string }) => useControllableState({ value, defaultValue: "ignored" }),
      { initialProps: { value: "controlled" } },
    );
    expect(result.current[0]).toBe("controlled");
    rerender({ value: "changed" });
    expect(result.current[0]).toBe("changed");
  });

  it("setter updates state when uncontrolled and fires onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useControllableState({ defaultValue: 0, onChange }),
    );
    act(() => result.current[1](1));
    expect(result.current[0]).toBe(1);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("setter accepts an updater function when uncontrolled", () => {
    const { result } = renderHookWithProviders(() =>
      useControllableState({ defaultValue: 1 }),
    );
    act(() => result.current[1]((prev) => prev + 10));
    expect(result.current[0]).toBe(11);
  });

  it("controlled setter does not change internal state but fires onChange with next value", () => {
    const onChange = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useControllableState({ value: "a", onChange }),
    );
    act(() => result.current[1]("b"));
    expect(onChange).toHaveBeenCalledWith("b");
    // Still reflects the controlled prop
    expect(result.current[0]).toBe("a");
  });

  it("forwards extra event args to onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useControllableState({ defaultValue: false, onChange }),
    );
    const event = { target: {} };
    act(() => result.current[1](true, event));
    expect(onChange).toHaveBeenCalledWith(true, event);
  });

  it("warns in development when controlled setter is called without onChange", () => {
    const { result } = renderHookWithProviders(() =>
      useControllableState({ value: "a" }),
    );
    act(() => result.current[1]("b"));
    expect(consoleWarn).toHaveBeenCalled();
  });

  it("does not warn when uncontrolled", () => {
    const { result } = renderHookWithProviders(() =>
      useControllableState({ defaultValue: "a" }),
    );
    act(() => result.current[1]("b"));
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});
