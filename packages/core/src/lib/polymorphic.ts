import React from "react";
import type { ElementType } from "react";
import type { PropsWithAs, PolymorphicRef } from "@core/types/props";

export type ForwardRefWithAs<P, D extends ElementType> = <As extends D = D>(
  props: PropsWithAs<P, As> & { ref?: PolymorphicRef<As> },
) => React.ReactElement | null;

/**
 * Create a polymorphic component that forwards refs and preserves type inference for `as`.
 *
 * @template P - component's own props (excluding `as` and native element props)
 * @template D - default element type (e.g. `'div'` or a union of allowed intrinsic elements)
 * @param render - generic render function with signature `(props, ref) => ReactElement | null`
 * @returns a component type that accepts `PropsWithAs<P, As>` with a correctly-typed `ref` for `As`.
 *
 * Notes:
 * - `React.forwardRef` cannot accept a genuinely generic render function. We therefore perform a single,
 *   localized cast here so implementations get full generic typing while the public component type is safe.
 * - Consumers pick `As` at call-site (the returned component is itself generic in `As`), but implementations
 *   only need to declare `P` and `D` and can rely on `PropsWithAs`/`PolymorphicRef` for correct types.
 */
export function forwardRefWithAs<P, D extends ElementType = "div">(
  render: <As extends D = D>(
    props: PropsWithAs<P, As>,
    ref: PolymorphicRef<As>,
  ) => React.ReactElement | null,
): ForwardRefWithAs<P, D> {
  // React.forwardRef expects a non-generic ForwardRefRenderFunction; we cast here
  // to localize the unavoidable type-escape required to accept a truly generic render fn.
  return React.forwardRef(
    render as unknown as React.ForwardRefRenderFunction<any, any>,
  ) as unknown as ForwardRefWithAs<P, D>;
}
