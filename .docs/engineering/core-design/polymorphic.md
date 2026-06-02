# Polymorphic component strategy

This document explains the polymorphic approach used in `core` and the rationale for a localized type-escaped cast.

## Overview

We provide a small, centralized helper `forwardRefWithAs` (see `packages/core/src/lib/polymorphic.ts`) to build
polymorphic React components that:

- accept an `as` prop to render different intrinsic elements or custom components;
- forward refs with the correct element-specific type; and
- keep component-`own` props (`P`) separate from native element props.

This pattern is inspired by Radix UI's `react-polymorphic` pattern and other libraries that expose ergonomic
`as`-based components while keeping strong TypeScript types for consumers.

## Why a localized type-escape is necessary

`React.forwardRef`'s type signature does not accept a truly generic render function (i.e. a render fn that is
generic in the `As` type parameter). To support per-call `as` inference we need the implementation function
to be generic in `As`, but `React.forwardRef`'s typing blocks that shape.

To work around this, `forwardRefWithAs` accepts a generic render function and performs a single, localized cast
when calling `React.forwardRef`. This keeps the cast in one place rather than littering component implementations
with `any` or manual casts.

## How we keep safety

Although we perform a cast inside the helper, we enforce type safety in these ways:

- `P` (component own props): components declare their own props (e.g. `FlexOwnProps`) and pass that to the helper.
- `D` (default/allowed elements): callers of the helper pick a `D` (e.g. `AllowedFlexElements`) to restrict which
  elements are permitted via `as` — this preserves narrowing and useful editor completions.
- `PropsWithAs<P, As>` merges the component props with the native props of `As` while giving precedence to
  the component's own props on conflicts. `PolymorphicRef<As>` extracts the correct `ref` type for `As`.

Because the cast is centralized, implementors still get full generics when writing the render function. Consumers
benefit from correctly-typed `as` usage and `ref` inference, and the surface area of the type-escape is tiny.

## Design & Type Walkthrough

This section documents the concrete types and how they map to runtime usage.

- `PolymorphicRef<As extends ElementType>`
  - Implementation: `export type PolymorphicRef<As extends ElementType> = ComponentPropsWithRef<As>["ref"]`.
  - Purpose: extracts the correct `ref` type for a chosen `As` (e.g. `'a'` => `Ref<HTMLAnchorElement>`).

- `PropsWithAs<P, As extends ElementType>`
  - Implementation (simplified):
    `type PropsWithAs<P, As> = MergeProps<Omit<ComponentPropsWithRef<As>, keyof P | 'ref'>, P & { as?: As }>`.
  - Purpose: merges native props for `As` with the component's own props `P`, omitting keys that `P` owns and excluding `ref`.

- `RestrictedPropsWithAs<P, Allowed extends ElementType>`
  - Alias that constrains `As` to a narrower set (e.g. `"div" | "section" | ...`). Use this to provide better editor hints and safer `as` choices.

- `ForwardRefWithAs<P, D extends ElementType>`
  - Implementation (shape):
    `type ForwardRefWithAs<P, D> = <As extends D = D>(props: PropsWithAs<P, As> & { ref?: PolymorphicRef<As> }) => React.ReactElement | null`.
  - Purpose: the exported component type. Outer generics `P` and `D` are fixed by the component; the returned function type is itself generic in `As` so call-sites can choose the rendered element.

- `forwardRefWithAs` helper
  - Signature (simplified):
    `function forwardRefWithAs<P, D = 'div'>(render: <As extends D>(props: PropsWithAs<P, As>, ref: PolymorphicRef<As>) => ReactElement | null): ForwardRefWithAs<P, D>`
  - Purpose: accept a generic render function and return a properly-typed polymorphic component. Internally it performs a single cast to `React.forwardRef` because `forwardRef`'s typing does not accept a genuinely generic render function.

### Example (Flex)

```ts
// component own props
export interface FlexOwnProps { /* direction, gap, padding... */ }

// merged, consumer-facing polymorphic props
export type FlexProps<As extends AllowedFlexElements = 'div'> = PropsWithAs<FlexOwnProps, As>;

// implementation receives the merged FlexProps and the correctly-typed ref
const _Flex = <As extends AllowedFlexElements = 'div'>(props: FlexProps<As>, ref: PolymorphicRef<As>) => { /* ... */ };

// Export using the helper: pass the component's own props (P) and the allowed D set.
export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(_Flex);
```

Key point: pass `FlexOwnProps` (the component's own prop shape) into `forwardRefWithAs` as `P`. The helper constructs `PropsWithAs<FlexOwnProps, As>` for callers. Passing `FlexProps` (which is already `PropsWithAs<...>`) would produce a nested/incorrect merge and break inference.

### Developer notes

- Export the `OwnProps` type for each polymorphic component (e.g. `FlexOwnProps`) so it can be reused by the helper and by tests.
- Prefer `RestrictedPropsWithAs` when you want to limit which intrinsic elements are allowed via `as`.
- Keep the centralized cast in `forwardRefWithAs`; it localizes the escape hatch and makes component implementations simpler and strongly-typed.


## Usage pattern

1. Define component own props (e.g. `FlexOwnProps`).
2. Implement the generic render function `_Comp = <As extends Allowed = 'div'>(props: PropsWithAs<...>, ref) => {}`.
3. Export the component using the helper: `export const Comp = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(_Comp)`.

## Trade-offs

- Pros: single centralized cast, good consumer ergonomics, predictable typing for `as` and `ref`.
- Cons: a tiny, focused escape hatch — intentional and documented.

## Migration

To migrate an existing polymorphic component:

1. Extract (or confirm) the `OwnProps` type.
2. Implement the generic render fn as `_Name` (props, ref).
3. Export using `forwardRefWithAs<OwnProps, AllowedElements>(_Name)`.

This keeps most of the work mechanical and reduces per-component `any` usage over time.
