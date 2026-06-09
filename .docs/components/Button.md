# Button

A flexible, accessible button component with multiple variants, colors, sizes, and states. Supports loading indicators, disabled states, and polymorphic rendering as buttons or links.

```tsx
import { Button } from "@basic-ui/core";

<Button variant="solid" color="primary">
  Click me
</Button>;
```

## Overview

The `Button` component is designed for consistent, accessible user interactions across your application. It supports:

- Multiple visual variants (solid, ghost, outline, link)
- Semantic color schemes (primary, secondary, error, success, warning, info, etc.)
- Responsive sizing (sm, md, lg)
- Loading states with optional custom icons and text
- Disabled states with proper accessibility
- Polymorphic rendering as button or anchor elements
- Custom link components (Next.js Link, React Router, etc.)

## Examples

### Basic Usage

```tsx
<Button variant="solid" color="primary">
  Primary Button
</Button>

<Button variant="ghost" color="secondary">
  Ghost Button
</Button>

<Button variant="outline" color="error">
  Outline Button
</Button>

<Button variant="link" color="info">
  Link Button
</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Loading State

```tsx
// Basic loading
<Button loading>Submit</Button>

// With custom loading text
<Button loading loadingText="Processing">
  Submit
</Button>

// With custom loading icon
const CustomIcon = <span aria-hidden>★</span>;
<Button loading loadingIcon={CustomIcon}>
  Loading
</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled</Button>

// Combined with loading
<Button disabled loading>
  Disabled + Loading
</Button>
```

### As Anchor/Link

```tsx
// Native anchor
<Button as="a" href="/page" color="primary">
  Navigate
</Button>

// With custom link component (Next.js, React Router, etc.)
<Button 
  as="a" 
  linkComponent={NextLink} 
  href="/docs"
  color="primary"
>
  Go to Docs
</Button>
```

### With Click Handler

```tsx
const handleClick = () => {
  console.log('Button clicked');
};

<Button onClick={handleClick}>
  Click Me
</Button>
```

## API

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `'solid' \| 'ghost' \| 'outline' \| 'link'` | `'solid'` | Visual style variant of the button |
| `color` | `'default' \| 'muted' \| 'primary' \| 'secondary' \| 'error' \| 'success' \| 'warning' \| 'info'` | `'default'` | Semantic color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size (responsive values supported) |
| `disabled` | `boolean` | `false` | Disables the button and applies disabled styles |
| `loading` | `boolean` | `false` | Shows loading state with spinner/icon |
| `loadingText` | `string` | — | Optional text to display during loading state |
| `loadingIcon` | `React.ReactNode` | — | Custom loading icon (defaults to spinner) |
| `as` | `'button' \| 'a'` | `'button'` | Polymorphic element type |
| `linkComponent` | `React.ElementType` | — | Custom link component (Next.js Link, React Router Link, etc.) |
| `className` | `string` | — | Additional CSS classes |
| `children` | `React.ReactNode` | — | Button content |

## Accessibility

- **Keyboard Navigation**: Fully keyboard accessible with proper focus states
- **Disabled State**: Uses `aria-disabled` and removes from tab order for non-button elements
- **Loading State**: Uses `aria-busy` to indicate loading state to screen readers
- **Focus Management**: Includes `focus-visible` ring for keyboard navigation
- **Semantic HTML**: Renders as `<button>` by default, or appropriate element when using `as` prop

## Stories & Source

- Storybook examples: `Button/Default`, `Button/Variants`, `Button/Sizes`, `Button/Loading`, `Button/Disabled`, `Button/WithClickAction`, `Button/AsAnchor`, `Button/WithCustomLinkComponent`
- Source: https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/Button
