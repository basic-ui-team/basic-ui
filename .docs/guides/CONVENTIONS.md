# Conventions — basic-ui

This document captures the lightweight, pragmatic conventions used across the basic-ui monorepo.
Keep it short and follow it when adding components, hooks, tests, and docs.

## Where this lives

- File: `.docs/guides/CONVENTIONS.md`
- Purpose: single source of truth for code + file conventions

## Component folder structure

Recommended layout for each component:

```
ComponentName/
  ComponentName.tsx          # main component implementation
  componentName.types.ts     # props and public types (camelCase allowed)
  componentName.variants.ts  # variant definitions (camelCase allowed)
  ComponentName.test.tsx     # unit / accessibility tests
  ComponentName.stories.tsx  # Storybook stories
  index.ts                   # re-export
```

Notes:
- The library tolerates supporting files in camelCase (e.g. `alert.types.ts`) to visually distinguish the main component file. If you prefer PascalCase for all files, update this doc and run a repo-wide rename.
- Keep the public API surface small — prefer `export * from './components'` in `packages/core/src/index.ts`.

## Polymorphic component pattern

- Use the `forwardRefWithAs` helper for polymorphic components.
- Component implementation signature:

```ts
const _MyComp = <As extends AllowedElements = 'div'>(
  props: MyCompProps<As>,
  ref: PolymorphicRef<As>,
) => { /* ... */ };

export const MyComp = forwardRefWithAs<MyCompOwnProps, AllowedElements>(_MyComp);
```

- Do not use manual `forwardRef` + `as any` cast patterns — they are error-prone.

## Hooks & responsive props

- Use `useBreakpoint()` once inside `useResponsiveProps` and resolve responsive objects with a pure resolver function. Avoid calling `useResponsive` per prop.
- Keep `orderedKeys` stable across renders when provided.

## Exports & TypeScript

- `packages/*/package.json` should include a main `exports` entry and `typesVersions` to help TS resolve deep imports. Example:

```json
"exports": { 
  ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./package.json": "./package.json"
}
"typesVersions": { "*": { "*": ["./dist/*"] } }
```

- Prefer the package's main entrypoint for consumers: `import { Alert } from '@basic-ui/core'`.

## Component composition rule (#60)

Components in `packages/core/src/components/**` follow these rules. Full rationale and dependency audit: `.docs/engineering/core-design/component-import-analysis.md`.

1. **Primitive layer:** `Box` is the styled-element foundation. Any component may import it. It is the only public component that may be imported by other components.
2. **No sibling imports:** a component may not import another public component except `Box`. Composing richer components happens via explicit props (render slots, e.g. `Alert.icon`, `Button.loadingIcon`) or children — never hidden internal renders.
3. **Own anatomy is fine:** files within a component's own folder (context, variants, types, parts) may import each other freely.
4. **Shared internals** (hooks, helpers) go to `@basic-ui/react-utilities`, not into another component.

Enforced by `scripts/check-component-imports.mjs` in CI (see Enforcement below).

## Layout utilities

- Keep layout helpers (e.g. `splitLayoutProps`, `generateLayoutClassNames`) under `packages/core/src/lib/layout` and export them from the library internal `layout` barrel.

## Tests & Accessibility

- Aim for an accessibility-focused test for every interactive component. Tests should at minimum assert:
  - semantic roles (e.g., `role="alert"` vs `role="status"`)
  - keyboard accessibility for dismiss/activation (Tab, Enter/Space)
  - presence/absence of ARIA attributes when required

- Use `renderWithProviders` and `setupUser()` helpers in tests.

## Storybook & Docs

- Keep Storybook stories minimal and use play functions for integration/assertions when helpful.
- Document component API in the docs site (`apps/docs`) and link back to the source where useful.

## Adding a new component

1. Create component folder using the structure above.
2. Add a Storybook story and a simple accessibility test.
3. Export the component from `packages/core/src/components/index.ts`.
4. Run `pnpm -w run type-check && pnpm -w run test`.

## Enforcement & Reviews

- Reviewers should check for: consistent naming, exported API, proper typing, and basic a11y tests.
- Consider adding lint or commit hooks if the team agrees to enforce naming conventions automatically.
- `scripts/check-component-imports.mjs` runs in CI and fails when a component imports a sibling public component other than `Box` (see the composition rule above).

---

If you want a stricter variant (PascalCase-everything), say the word and I will prepare a rename plan and automated patch.
