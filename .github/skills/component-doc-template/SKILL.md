---
name: component-doc-template
description: "Provides a markdown documentation template for UI components and guidance for filling it out. Generates a template that follows the structure used by Alert.md."
argument-hint: "Component name or path (e.g., packages/core/src/components/Pagination/TablePagination)"
user-invocable: true
---

# Component Documentation Template Skill

Use this skill to generate consistent component documentation markdown files following the project's documentation style.

## Template (copy into `.docs/components/<Component>.md`)


# {Component Display Name}

One-line summary describing what the component does and when to use it.

```tsx
import { {ComponentName} } from "basic-ui/core"

// Basic example
<{ComponentName} propA={value} />
```

## Overview

Short paragraph describing the component, its purpose, and any important notes (styling system, theming, variants).

## When to use

- Bullet of common use cases
- Bullet of when not to use it

## Variants / Appearance

- List and short descriptions of visual variants (e.g. `default`, `inline`, `compact`).

## Examples

### Basic

```tsx
// Minimal example
```

### Advanced

```tsx
// Example showing variants, actions, or composition
```

### Controlled vs Uncontrolled

Explain controlled/uncontrolled behavior and show examples when applicable.

## API

| **Prop** | Type | Default | Description       |
| -------- | ---- | ------- | ----------------- |
| propName | type | default | Short description |

(Include all public props. For polymorphic components, document `as`/`itemsAs` and related behaviors.)

## Accessibility

- Keyboard support and focus behavior
- ARIA roles, attributes, and recommended usage
- Any a11y caveats or notes (e.g., focus management, announcements)

## Stories

- Link to Storybook stories for interactive examples (if present).

## Source

Source: https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/{ComponentName}

---

## Guidance

- Keep examples minimal and focused on the most common use cases.
- Document accessibility expectations (role, aria attributes, keyboard behavior).
- Prefer showing both controlled and uncontrolled usage when applicable.
- Mention companion hooks/utilities (e.g., `usePagination`) if relevant.

## Usage

Invoke the skill with the component name; it will return a filled template following the `Alert.md` structure, substituting `{ComponentName}` and `{Component Display Name}` where appropriate.
