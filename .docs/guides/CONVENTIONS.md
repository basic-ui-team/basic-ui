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

## Responsive props

Use `ResponsiveValue<T>` when size, spacing, or layout should adapt to the
available space. Keep colors, cosmetic variants, interaction state, and
accessibility attributes independent of viewport size. Use CSS for responsive
presentation rather than selecting styles with a viewport hook.

Keep styling in the component's variant file. Use `getResponsiveClassNames` to
resolve each responsive value into its classes:

```ts
getResponsiveClassNames(size, currentSize =>
  sizeVariants({ size: currentSize }),
);
```

The callback should return only the styles controlled by that prop, not the
whole component recipe. Keep unrelated defaults, colors, and focus styles out
of it. Normal CVA compounds can still combine responsive size with scalar state.

CSS overrides earlier declarations; it does not replace an entire recipe.
When a value turns styling off, emit an explicit reset rather than an empty
string. Test transitions in both directions.

Omitted breakpoints inherit the last supplied value, not the base value.
Layout props do not accept `unset`: use `0` for spacing, `"auto"` for dimensions,
`"none"` for maximum dimensions, and `"visible"` for overflow resets.
`useResponsiveProps` has been removed; reserve `useBreakpoint` for behavior,
not presentation.

Coordinate child parts when their geometry is coupled to the parent's size.
Do not implicitly resize content supplied by the consumer.

### Generating responsive CSS

Responsive utilities must be present in the shipped stylesheet. Supported
families and values live in
[`responsive-utilities.ts`](../../packages/core/src/lib/responsive-utilities.ts).
Composing existing utilities in a new recipe needs no generator registration.

If a required utility is missing, review whether it belongs in a shared family
and extend that family rather than adding a component-specific list. Regenerate
the stylesheet and include it with your change:

```sh
pnpm --filter @basic-ui/core generate:layout-utilities
pnpm --filter @basic-ui/core check:layout-utilities
```

Test both the component's class output and the resulting CSS. A class appearing
in the DOM does not prove that the stylesheet contains it. Add actual geometry
maps or compound outputs to `scripts/responsive-utilities.css.test.ts`; test-only
recipe imports are intentional, while the production generator stays independent.
See the
[responsive CSS design](../engineering/core-design/responsive-css.md) for the
supported capabilities and current migration scope.

## Exports & TypeScript

- `packages/*/package.json` should include a main `exports` entry with a `types` condition per entry. Do not add `typesVersions`; the repo supports modern bundler resolution only. Core also advertises per-component entries through a wildcard:

```json
"exports": {
  ".": { "types": "./dist/index.d.ts", "dev": "./src/index.ts", "import": "./dist/index.js" },
  "./styles.css": "./dist/styles.css",
  "./package.json": "./package.json",
  "./*": {
    "types": "./dist/components/*/index.d.ts",
    "dev": "./src/components/*/index.ts",
    "import": "./dist/components/*/index.js"
  }
}
```

- `@basic-ui/core` supports two import forms. Both tree-shake; per-component imports are the preferred form for libraries and lean bundles:
  - Root: `import { Alert } from "@basic-ui/core"` (convenience barrel)
  - Per component: `import { Alert, type AlertProps } from "@basic-ui/core/Alert"`
  - Every `src/components/<Name>/index.ts` is a public entry; `Pagination` stays one grouped entry (`@basic-ui/core/Pagination` exports `TablePagination` and `LinkPagination`).
- Every workspace package exposes a `dev` export condition mapping to `src/`, and it is **workspace-only**: `src/` is not published (`files: ["dist"]`), so published/default consumers always resolve `dist/`. Local tooling must opt in explicitly — Storybook appends `dev` to Vite's default `resolve.conditions` and sets TS `customConditions: ["dev"]`; source aliases are not needed. Note that TS resolves types through the `types` condition first, so editor types still come from the built declarations.
- `@basic-ui/core` declares `sideEffects: ["**/*.css"]`; modules contain no import-time side effects, so bundlers may tree-shake unused component entries. Preserve this when adding components.
- Verify packaging changes with `pnpm --filter @basic-ui/core verify:package`: clean double build, pack + extracted-tarball inspection (ships only dist, declarations resolve without workspace aliases, React externalized), runtime imports of every public entry, and an external-style TS fixture.


## Component composition rule (#60)

Components in `packages/core/src/components/**` follow these rules. Full rationale and dependency audit: `.docs/engineering/core-design/component-import-analysis.md`.

1. **Primitive layer:** `Box` is the styled-element foundation and `Icon` is the SVG presentation primitive. Any component may import either one.
   - **Placement (#84):** `Box` lives in `@basic-ui/core` at `components/Box` — by convention, not in a separate package. The composition rule plus the CI check (`scripts/check-component-imports.mjs`) provide the structural guarantee; a dedicated package would add dependency and packaging overhead without behavioral benefit.
   - **Import specifier:** always import primitives relatively, e.g. `import { Box, BoxProps } from "../Box"` or `import { Icon } from "../Icon"` (depth-adjusted). Do not use `@core/components`, component aliases, or other aliases — the relative form keeps the primitive dependency explicit and refactor-safe.
2. **No sibling imports:** a component may not import another public component except `Box` and `Icon`. Composing richer components happens via explicit props (render slots, e.g. `Alert.icon`, `Button.loadingIcon`) or children — never hidden internal renders. Put cross-component behavior in shared hooks and helpers instead.
3. **Own anatomy is fine:** files within a component's own folder (context, variants, types, parts) may import each other freely.
4. **Shared internals** (hooks, helpers) go to `@basic-ui/react-utilities`, not into another component.

Enforced by `scripts/check-component-imports.mjs` in CI (see Enforcement below).

## Layout utilities

Use Box for shared spacing, sizing, and layout props instead of handling them
again in each component. Layout props should become classes, not DOM attributes.

Shared layout types, recipes, and helpers live in
[`packages/core/src/lib`](../../packages/core/src/lib). Recipe keys match the
public prop names, such as `p` and `hMin`.

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
- `scripts/check-component-imports.mjs` runs in CI and fails when a component imports a sibling public component other than `Box` or `Icon` (see the composition rule above).

---

If you want a stricter variant (PascalCase-everything), say the word and I will prepare a rename plan and automated patch.
