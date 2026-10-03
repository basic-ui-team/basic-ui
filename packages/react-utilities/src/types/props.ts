import type { ComponentPropsWithRef, ElementType } from "react";

/**
 * Core props that all basic-ui components accept.
 * Provides a consistent set of common props for styling, accessibility, and content.
 */
export type CommonProps = {
  /** Optional CSS class name(s) for custom styling. */
  className?: string;
  /** Optional inline styles. Use with caution; prefer className for styling. */
  style?: React.CSSProperties;
  /** Optional HTML id attribute for accessibility and testing. */
  id?: string;
  /** Content to be rendered inside the component. */
  children?: React.ReactNode;
};

/**
 * Utility to merge two prop sets, with the right-hand side taking precedence on conflicts.
 *
 * Used internally by polymorphic helpers to ensure component props always override native element props.
 *
 * @example
 * type Merged = MergeProps<{ a: string; b: number }, { b: string }>;
 * // Result: { a: string; b: string } (b is overridden by T)
 */
export type MergeProps<P, T> = Omit<P, keyof T> & T;

/**
 * Extract the React `ref` prop type for a given element type.
 *
 * Returns the correct React ref type for the element/component (e.g., `React.Ref<HTMLButtonElement> | undefined`
 * for `'button'`, `React.Ref<HTMLAnchorElement> | undefined` for `'a'`).
 * Used to type ref parameters correctly on polymorphic components.
 *
 * @example
 * type ButtonRef = PolymorphicRef<'button'>;  // React.Ref<HTMLButtonElement> | undefined
 * type AnchorRef = PolymorphicRef<'a'>;      // React.Ref<HTMLAnchorElement> | undefined
 */
export type PolymorphicRef<As extends ElementType> = ComponentPropsWithRef<As>["ref"];

/**
 * Merge a component's own props with a polymorphic element's props and `as` prop.
 *
 * Combines component-specific props with the native props of the element specified by `as`.
 * Component props take precedence over native element props on conflict. The `as` prop is
 * optional and allows switching the render target between element types.
 *
 * **Key behaviors:**
 * - Component props (P) override conflicting native element props
 * - The `as` prop is always optional; defaults are set at component definition
 * - `ref` is excluded and handled via `PolymorphicRef` to avoid conflicts
 * - Native element props (onClick, className, href, etc.) are available based on `As`
 *
 * @example
 * // Component props
 * type ButtonOwnProps = { variant?: 'primary' | 'secondary' } & CommonProps;
 *
 * // Polymorphic type: accepts any element type
 * type ButtonProps<As extends ElementType = 'button'> = PropsWithAs<ButtonOwnProps, As>;
 *
 * // Usage: default (button)
 * const el1: ButtonProps = { variant: 'primary', onClick: () => {} };
 *
 * // Usage: anchor
 * const el2: ButtonProps<'a'> = { as: 'a', href: '/', variant: 'primary' };
 *
 * // Usage: custom component
 * const el3: ButtonProps<typeof CustomLink> = { as: CustomLink, to: '/' };
 */
export type PropsWithAs<P, As extends ElementType> = MergeProps<
  Omit<ComponentPropsWithRef<As>, keyof P | "ref">,
  P & { as?: As }
>;

/**
 * Restrict a polymorphic component to render only as specific element types.
 *
 * Use this to prevent invalid polymorphic assignments and provide better developer ergonomics.
 * The generic constraint `As extends 'button' | 'a' | ...` enforces which `as` values are allowed.
 *
 * **Pattern:**
 * Define a union of allowed elements, then constrain the generic to that union.
 * This provides both type safety and clear IDE hints.
 *
 * @example
 * // Button can only render as button or a
 * type AllowedButtonElements = 'button' | 'a';
 * type ButtonProps<As extends AllowedButtonElements = 'button'> = RestrictedPropsWithAs<ButtonOwnProps, As>;
 *
 * // Now: <Button as="button" /> ✓
 * //      <Button as="a" href="/" /> ✓
 * //      <Button as="div" /> ✗ TypeScript error: Type 'div' is not assignable to 'button | a'
 */
export type RestrictedPropsWithAs<P, Allowed extends ElementType> = PropsWithAs<P, Allowed>;

// Need to think about the design of this more and how to resolve the `as` prop with the correct ref type without causing conflicts with component props.
// For now, we just ensure that components are defined using RestrictedPropsWithAs for the component props and PolymorphicRef for the ref type, and we exclude ref from the merged props to avoid conflicts.
// This means that the component's own props will always take precedence over native element props, and the `as` prop is always optional and defaults to a specific element type at the component level.
//   As extends ElementType = 'div',
// > = <Element extends As>(
//   props: P & { ref?: PolymorphicRef<Element> },
// ) => React.ReactElement | null;
