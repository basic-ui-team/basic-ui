import { describe, it, expect } from "vitest";
import { renderHookWithProviders } from "@core/test-utils/renderHookWithProviders";
import { useResponsiveProps } from "@core/hooks";

describe("useResponsiveProps", () => {
  it("resolves primitive values", () => {
    const { result } = renderHookWithProviders((props: any) => useResponsiveProps(props), {
      initialProps: { width: "md", height: 120 },
    });

    expect(result.current.width).toBe("md");
    expect(result.current.height).toBe(120);
  });

  it("handles undefined values", () => {
    const { result } = renderHookWithProviders((props: any) => useResponsiveProps(props), {
      initialProps: { padding: undefined },
    });

    expect(result.current.padding).toBeUndefined();
  });

  it("returns the same reference when inputs don't change", () => {
    const { result, rerender } = renderHookWithProviders((props: any) => useResponsiveProps(props), {
      initialProps: { a: 1, b: "x" },
    });

    const first = result.current;
    rerender({ a: 1, b: "x" });
    expect(result.current).toStrictEqual(first);
  });
});
