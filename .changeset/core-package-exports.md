---
"@basic-ui/core": minor
---

Add per-component package exports to `@basic-ui/core` and repair the
published build surface.

New import forms (both tree-shake; existing root and stylesheet imports
keep working):

```ts
import { Button, Card } from "@basic-ui/core";
import { Card, type CardProps } from "@basic-ui/core/Card";
import { TablePagination, LinkPagination } from "@basic-ui/core/Pagination";
```

- Every `components/<Name>/index.ts` convention directory is a public entry,
  advertised through a wildcard package export mapping to
  `dist/components/<Name>/index.js` with matching declarations. Pagination
  remains one grouped entry.
- New public exports: `Card`, `Header`, `Image`, and `Skeleton` (with their
  prop types) are exported from the root barrel; `Card`'s compound members
  and prop/component types are exported from its own entry; `Skeleton` gains
  its component entry.
- Build fixes: declarations are no longer erased by the Vite build step
  (`dist/index.d.ts` now really exists), React/React DOM including their
  runtime subpaths are externalized instead of being bundled into Core
  output, and story/test declarations are no longer emitted.
- Manifest: remove legacy `typesVersions`, declare
  `sideEffects: ["**/*.css"]` after an import-time side-effect audit, and add
  a workspace-only `dev` export condition so local tooling (Storybook) can
  resolve Core source during development. `src/` remains unpublished.
- TypeScript types for TS < 4.7 / non-`exports`-aware tooling are no longer
  supported via `typesVersions`.
