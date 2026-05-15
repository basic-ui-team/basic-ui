import type { ComponentPropsWithRef, ElementType } from "react";

/**
 * Core props that all basic-ui components accept.
 * 
 * These form the minimal, reusable foundation for component props.
 * - `className`: CSS class names for styling and customization
 * - `style`: Inline styles (used sparingly; prefer className with tailwindcss)
 * - `id`: HTML identifier for accessibility and testing
 * - `children`: Rendered content inside the component
 */
export type CommonProps = {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
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
 * Extract the ref type for a given element type.
 * 
 * Returns the correct ref type (e.g., HTMLButtonElement for 'button', HTMLAnchorElement for 'a').
 * Used to type ref parameters correctly on polymorphic components.
 * 
 * @example
 * type ButtonRef = PolymorphicRef<'button'>;  // HTMLButtonElement | null
 * type AnchorRef = PolymorphicRef<'a'>;      // HTMLAnchorElement | null
 */
export type PolymorphicRef<As extends ElementType> = ComponentPropsWithRef<As>['ref'];

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
  Omit<ComponentPropsWithRef<As>, keyof P | 'ref'>,
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

/**
 * Type signature for a polymorphic component, used to properly type `forwardRef` exports.
 * 
 * Represents a component that accepts polymorphic props, a ref, and returns a React element.
 * Use this when casting a `forwardRef`'d generic component to ensure ref types are preserved.
 * 
 * The element type is inferred from the props passed in (via `PropsWithAs<P, Element>`).
 * 
 * @example
 * type AllowedAlertElements = 'div' | 'span' | 'p';
 * 
 * const _Alert = <As extends AllowedAlertElements = 'div'>(
 *   props: AlertProps<As>,
 *   ref?: PolymorphicRef<As>
 * ) => { ... };
 * 
 * export const Alert = forwardRef(_Alert) as PolymorphicComponent<AlertProps, AllowedAlertElements>;
 */
export type PolymorphicComponent<
  P,
  As extends ElementType = 'div',
> = <Element extends As>(
  props: P & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;

export default {} as {
  // placeholder default export so this file can be imported in non-typecheck scenarios
};
