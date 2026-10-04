import { renderWithProviders, renderHookWithProviders } from "../../test-utils";
import { describe, it, expect } from "vitest";
import { useId, useAriaIds } from "./useId";

describe("useId", () => {
  it("returns a stable id across re-renders", () => {
    const { result, rerender } = renderHookWithProviders(() => useId());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("prepends the prefix", () => {
    const { result } = renderHookWithProviders(() => useId("label"));
    expect(result.current.startsWith("label-")).toBe(true);
  });

  it("returns distinct ids for distinct hook calls", () => {
    function Component() {
      const a = useId("a");
      const b = useId("b");
      return (
        <>
          <span data-testid="a" id={a} />
          <span data-testid="b" id={b} />
        </>
      );
    }
    const { getByTestId } = renderWithProviders(<Component />);
    expect(getByTestId("a").id).not.toBe(getByTestId("b").id);
  });
});

describe("useAriaIds", () => {
  it("wires label htmlFor/id and aria-labelledby", () => {
    const { result } = renderHookWithProviders(() => useAriaIds({ prefix: "test" }));
    expect(result.current.labelProps.htmlFor).toBe(result.current.fieldProps.id);
    expect(result.current.fieldProps["aria-labelledby"]).toBe(result.current.labelId);
  });

  it("omits aria-describedby when no description and no error", () => {
    const { result } = renderHookWithProviders(() => useAriaIds());
    expect(result.current.fieldProps["aria-describedby"]).toBeUndefined();
    expect("aria-invalid" in result.current.fieldProps).toBe(false);
  });

  it("includes only the description id when description requested", () => {
    const { result } = renderHookWithProviders(() => useAriaIds({ description: true }));
    expect(result.current.fieldProps["aria-describedby"]).toBe(result.current.descriptionId);
  });

  it("includes description and error ids and aria-invalid when erroring", () => {
    const { result } = renderHookWithProviders(() =>
      useAriaIds({ description: true, error: true }),
    );
    const describedBy = result.current.fieldProps["aria-describedby"];
    expect(describedBy).toContain(result.current.descriptionId);
    expect(describedBy).toContain(result.current.errorId);
    expect(result.current.fieldProps["aria-invalid"]).toBe(true);
  });

  it("includes only the error id when error without description", () => {
    const { result } = renderHookWithProviders(() => useAriaIds({ error: true }));
    expect(result.current.fieldProps["aria-describedby"]).toBe(result.current.errorId);
  });
});
