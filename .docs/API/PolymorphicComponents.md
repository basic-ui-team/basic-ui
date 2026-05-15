# Polymorphic Components: A Guide to basic-ui's Design Pattern

## Overview

**Polymorphic components** in basic-ui allow a single component to render as different HTML elements while maintaining full type safety and prop correctness. This guide explains the pattern, its tradeoffs, and how to extend it.

**Quick example:**
```tsx
// Default: renders as <div>
<Alert severity="error">Something failed</Alert>

// Polymorphic: render as <span>
<Alert as="span" severity="error">Something failed</Alert>

// Polymorphic: render as <p> with a ref
const ref = useRef<HTMLParagraphElement>(null);
<Alert as="p" severity="error" ref={ref}>Something failed</Alert>
```

---

## For TypeScript Beginners

### What does "polymorphic" mean?

In TypeScript (and programming in general), **polymorphic** means "many shapes." In this case, a component can take many shapes—many different element types—while behaving consistently.

Think of it like a light switch that works on any wall:
- You can install it on drywall, plaster, or metal
- It works the same way regardless of what's behind the wall
- But the mounting hardware *changes* depending on the wall type

In our components:
- `Alert` can render as `<div>`, `<span>`, `<p>`, etc.
- The component's behavior stays the same
- But the **HTML element type and its native props change** based on what you pass

### The `as` prop

The key is the **`as` prop**, which tells the component what element to render:

```tsx
<Alert as="div">      // Renders <div>
<Alert as="span">     // Renders <span>
<Alert as="p">        // Renders <p>
```

When you write `<Alert as="p">`, you get:
- All the Alert's props (`severity`, `title`, `onDismiss`, etc.)
- All the props of a `<p>` element (like `id`, `className`, `data-*` attributes)
- A ref typed as `HTMLParagraphElement` (not just `HTMLElement`)

### TypeScript Generics (The Simple Version)

Under the hood, this uses TypeScript **generics**—a way to write code that works with *any type*:

```typescript
// Read this as: "Alert can render as any element type (As)"
type AlertProps<As extends 'div' | 'span' | 'p' = 'div'>
```

The `<As extends 'div' | 'span' | 'p'>` means:
- `As` is a **placeholder** for an element type
- It can only be one of: `'div'`, `'span'`, or `'p'`
- The default is `'div'` if you don't specify `as`

---

## For Experienced TypeScript Developers

### Type Architecture

The polymorphic system is built on three core utilities:

#### 1. **`CommonProps`** — Shared props for all components

```typescript
export type CommonProps = {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  children?: React.ReactNode;
};
```

Minimal, stable, extensible. No presentational props here; those belong to component-specific props.

#### 2. **`PropsWithAs<P, As>`** — Merge component props with element props

```typescript
export type PropsWithAs<P, As extends ElementType> = MergeProps<
  Omit<ComponentPropsWithRef<As>, keyof P | 'ref'>,
  P & { as?: As }
>;
```

This does three things:
- Takes component-specific props (`P`)
- Merges them with the native props of element `As` (excluding `ref` and component prop conflicts)
- Adds the `as` prop
- **Component props always win on conflicts** (via `MergeProps`)

#### 3. **`RestrictedPropsWithAs<P, Allowed>`** — Constrain allowed elements

```typescript
export type RestrictedPropsWithAs<P, Allowed extends ElementType> = PropsWithAs<P, Allowed>;
```

Simply constrains the generic to a union of allowed elements:

```typescript
type AllowedAlertElements = 'div' | 'span' | 'p';
export type AlertProps<As extends AllowedAlertElements = 'div'> = 
  RestrictedPropsWithAs<AlertOwnProps, As>;
```

Now `<Alert as="button" />` is a compile-time error—prevents footguns.

### Implementation Pattern

```typescript
// 1. Define component-specific props
type AlertOwnProps = {
  severity?: 'info' | 'error' | 'warning' | 'success';
  title?: string;
  onDismiss?: () => void;
} & CommonProps;

// 2. Define allowed elements
type AllowedAlertElements = 'div' | 'span' | 'p';

// 3. Export typed props
export type AlertProps<As extends AllowedAlertElements = 'div'> = 
  RestrictedPropsWithAs<AlertOwnProps, As>;

// 4. Implement the generic function
const _Alert = <As extends AllowedAlertElements = 'div'>(
  { as, severity = 'info', ...props }: AlertProps<As>,
  ref?: PolymorphicRef<As>
) => {
  const Comp = (as || 'div') as As;
  return <Comp ref={ref} {...(props as any)} />;
};

// 5. Export with explicit generic signature
export const Alert = forwardRef(_Alert) as <Element extends AllowedAlertElements = 'div'>(
  props: AlertProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;
```

**Key insight:** The generic constraint is resolved at the **call site**:
- `<Alert>` → `Element = 'div'` (inferred from default)
- `<Alert as="p">` → `Element = 'p'` (inferred from `as` prop)
- Ref type updates automatically: `HTMLParagraphElement` for `as="p"`, etc.

### Why the explicit signature on export?

```typescript
// ❌ Wrong: abstract type loses inference
export const Alert = forwardRef(_Alert) as PolymorphicComponent<AlertProps, AllowedAlertElements>;

// ✅ Right: explicit signature allows proper element inference
export const Alert = forwardRef(_Alert) as <Element extends AllowedAlertElements = 'div'>(
  props: AlertProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;
```

Abstract types create a layer of indirection that confuses TypeScript's generic inference. Being explicit about the signature allows `Element` to be inferred from the `as` prop at usage sites.

---

## For Developers from Other Languages (C#, Java, Go)

### Comparison: Polymorphism Models

| Language | Pattern | Equivalent in basic-ui |
|----------|---------|------------------------|
| **C#** | `virtual` methods / interfaces | `as` prop constraints generics |
| **Java** | Extending abstract classes | Component-specific props extend `CommonProps` |
| **Go** | Interface satisfaction (implicit) | `PropsWithAs` merges component + element APIs |
| **Python** | Duck typing / `**kwargs` | Runtime flexibility, but TypeScript enforces at compile time |

### Key Differences

**Traditional OOP (C#, Java):**
```csharp
// You inherit from a base class and override methods
public class AlertButton : Button {
  public override void Render() { /* ... */ }
}

// Polymorphism is *class-based* (inheritance)
Button btn = new AlertButton();
```

**TypeScript Structural Typing (basic-ui):**
```typescript
// No inheritance. Instead, we compose prop types
type AlertProps = { severity: 'error' } & PropsWithAs<...>;

// Polymorphism is *structural* (based on what props you accept)
const alert: AlertProps<'div'> = /* ... */;
const alert2: AlertProps<'span'> = /* ... */;
```

### Mental Model: "Runtime Polymorphism via Props"

Think of it as **runtime dispatch through props**, not virtual method tables:

```typescript
const Comp = (as || 'div') as As;  // Decide at runtime which element to render
return <Comp {...props} />;         // Pass props to the chosen element
```

The element type is decided **at runtime** (from the `as` prop), but **TypeScript validates it at compile time** (via the generic constraint).

---

## Strengths

### 1. **Single Component, Multiple Uses**
```tsx
// Instead of separate components:
<AlertDiv />
<AlertSpan />
<AlertP />

// One component, many uses:
<Alert />
<Alert as="span" />
<Alert as="p" />
```

### 2. **Type Safety Without Ceremony**
```tsx
// ✅ IDE autocompletion works perfectly
<Alert as="p" ref={pRef} id="alert-1" />

// ❌ Wrong element? TypeScript catches it
<Alert as="button" />  // Error: 'button' not assignable to 'div' | 'span' | 'p'
```

### 3. **Correct Ref Types**
```tsx
const divRef = useRef<HTMLDivElement>(null);
const pRef = useRef<HTMLParagraphElement>(null);

<Alert ref={divRef} />          // ✅ Correct
<Alert as="p" ref={pRef} />     // ✅ Correct
<Alert as="p" ref={divRef} />   // ❌ Type error
```

### 4. **Composability**
Consumers can extend your components:
```tsx
// Wrapping Alert with custom defaults
export const ErrorAlert = (props) => <Alert severity="error" {...props} />;

// Still polymorphic!
<ErrorAlert as="span" />
```

### 5. **Minimal Runtime Overhead**
All polymorphism is compile-time. At runtime, it's just:
```tsx
const Comp = as || 'div';
return <Comp {...props} />;
```

---

## Tradeoffs

### 1. **Learning Curve**
Generics and `PropsWithAs` are powerful but require TypeScript understanding. Beginners must learn new patterns.

**Mitigation:** Provide clear templates and examples (✅ we do this).

### 2. **Not All Elements Fit**
Some components genuinely need specific elements:
```tsx
// These should NOT be polymorphic:
<Input />  // Must be <input> or <textarea>
<Button /> // Semantically a <button>, not a <div>
```

**Guideline:** Use `as` for **layout/presentational** components (Alert, Box, Card). Don't use it for **interactive** components that have semantic meaning.

### 3. **Complex Type Errors**
When something goes wrong, TypeScript error messages can be verbose:
```
Type '"button"' is not assignable to type 'div' | 'span' | 'p'.
```

**Mitigation:** Error messages improve with experience. Consider documenting common errors.

### 4. **Prop Forwarding Complexity**
You can't use destructuring with `...rest` and maintain full type safety:
```tsx
// ❌ Loses type info
const { severity, ...rest } = props;

// ✅ Keep props object intact where possible
<Comp ref={ref} {...(props as any)} />
```

---

## How to Extend

### Adding a New Polymorphic Component

Use this checklist:

1. **Define component-specific props:**
   ```typescript
   type MyComponentOwnProps = {
     variant?: 'primary' | 'secondary';
   } & CommonProps;
   ```

2. **Define allowed elements:**
   ```typescript
   type AllowedMyComponentElements = 'div' | 'section' | 'article';
   ```

3. **Create the props type:**
   ```typescript
   export type MyComponentProps<As extends AllowedMyComponentElements = 'div'> =
     RestrictedPropsWithAs<MyComponentOwnProps, As>;
   ```

4. **Implement the component:**
   ```typescript
   const _MyComponent = <As extends AllowedMyComponentElements = 'div'>(
     { as, variant = 'primary', ...props }: MyComponentProps<As>,
     ref?: PolymorphicRef<As>
   ) => {
     const Comp = (as || 'div') as As;
     return <Comp ref={ref} className={cn('my-comp', `my-comp--${variant}`)} {...(props as any)} />;
   };
   ```

5. **Export with signature:**
   ```typescript
   export const MyComponent = forwardRef(_MyComponent) as <Element extends AllowedMyComponentElements = 'div'>(
     props: MyComponentProps<Element> & { ref?: PolymorphicRef<Element> },
   ) => React.ReactElement | null;
   ```

### Restricting Polymorphism

Not all components should support all elements. Choose wisely:

```typescript
// Alert can be layout/semantic: <div>, <section>, <article>
type AllowedAlertElements = 'div' | 'section' | 'article';

// Card is more specific: only <div> or <article>
type AllowedCardElements = 'div' | 'article';

// Form field: only <div> (semantic meaning lost otherwise)
type AllowedFormFieldElements = 'div';
```

### Creating a Constrained Version

If you want a variant that only renders as one element:

```typescript
// In library
export const Alert = forwardRef(_Alert) as <Element extends AllowedAlertElements = 'div'>(
  props: AlertProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;

// In consumer app
export const SectionAlert = (props: AlertProps<'section'>) => <Alert as="section" {...props} />;
```

---

## Best Practices

### ✅ Do

- Use polymorphism for **layout/presentational** components (Alert, Box, Card, Stack)
- Constrain to **specific element types** that make semantic sense
- **Test polymorphic variations** (ensure `as="element"` works for all allowed elements)
- **Document** which elements are supported
- Use **refs** to access underlying elements when needed (e.g., for focus management)

### ❌ Don't

- Use polymorphism for **semantic/interactive** components (Input, Button, Select)
- Create overly broad element unions (`as` for *any* HTML element)
- Force polymorphism on components where it doesn't add value
- Forget to **test refs** with different `as` values
- Use `as={CustomComponent}` unless your component explicitly supports it (type it as `ElementType` if you do)

---

## Common Pitfalls

### 1. **Forgetting to Constrain Elements**
```tsx
// ❌ Too permissive
export type AlertProps<As extends ElementType = 'div'> = PropsWithAs<...>;

// ✅ Constrained
type AllowedAlertElements = 'div' | 'span' | 'p';
export type AlertProps<As extends AllowedAlertElements = 'div'> = RestrictedPropsWithAs<...>;
```

### 2. **Not Testing Polymorphic Variations**
Always test each supported `as` value:
```tsx
it("renders as div", () => { /* ... */ });
it("renders as span", () => { /* ... */ });
it("renders as p", () => { /* ... */ });
it("forwards ref correctly for each element", () => { /* ... */ });
```

### 3. **Breaking Refs with Wrong Casts**
```tsx
// ❌ Wrong: loses ref type info
<Comp ref={ref as any} {...props as any} />

// ✅ Right: preserve types where possible, cast strategically
<Comp ref={ref} {...(props as any)} />
```

### 4. **Overcomplicating the Signature**
```tsx
// ❌ Too abstract
export const Alert = forwardRef(_Alert) as PolymorphicComponent<AlertProps, AllowedAlertElements>;

// ✅ Direct and clear
export const Alert = forwardRef(_Alert) as <Element extends AllowedAlertElements = 'div'>(
  props: AlertProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;
```

---

## Resources

- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React forwardRef](https://react.dev/reference/react/forwardRef)
- [Radix UI's Polymorphic Approach](https://radix-ui.com/) (inspiration)
- [Our Props Documentation](./ Props.md)

---

## Summary

**basic-ui's polymorphic pattern is:**
- A **simple, composable** way to write flexible components
- **Type-safe** at compile time, with correct element/ref types
- **Extensible** for library consumers and contributors
- **Zero runtime overhead**—it's all compile-time sugar

Use it for layout and presentational components. Don't use it for semantic/interactive components. Keep the allowed elements constrained. Always test polymorphic variations.
