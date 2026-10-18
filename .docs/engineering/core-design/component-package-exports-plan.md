# Agent handoff: Core per-component package exports

## Task and stop condition

Implement ordinary per-component ESM packaging for `@basic-ui/core`, using a
wildcard package export and consistent component entry files. Repair missing
public component/type exports. Keep existing root imports and stylesheet imports
working. Stop after implementation, focused regression tests, documentation and
normal package gates pass. Do not publish or commit unless requested.

The user wants a narrow packaging change, not another architecture investigation.
Prefer existing Vite/TypeScript tooling and a small conventional configuration.

## Verified starting state

Checked 2026-10-18:

- Repository: `basic-ui-team/basic-ui`.
- Workspace: `C:\Users\letor\Programming\03_Projects\basic-ui`.
- Branch: `feature/responsive-css`.
- HEAD: `16046dc693a67fc205d48aa6b004b87b7bb4e22f`.
- Worktree was clean before this plan was added. Recheck before implementation;
  preserve any subsequent user changes.
- An earlier experimental optimisation patch was discarded. Do not assume the
  381-utility whitelist, manual pure annotations, display-name removals, or its
  tree-shaking test exist in the baseline. Do not reapply that patch.
- Core currently has a single Vite library entry and package exports only for
  the root, stylesheet and package metadata.
- Existing `dist` files can be leftovers from experiments. They are not proof
  that the configured build produces a valid package.

Relevant files:

- [Core manifest](../../../packages/core/package.json)
- [Core Vite config](../../../packages/core/vite.config.ts)
- [Core TypeScript config](../../../packages/core/tsconfig.json)
- [Root TypeScript config](../../../tsconfig.json)
- [Root component barrel](../../../packages/core/src/components/index.ts)
- [Card entry](../../../packages/core/src/components/Card/index.ts)
- [Stylesheet copy script](../../../packages/core/scripts/copy-styles.mjs)
- [Storybook config](../../../apps/storybook/.storybook/main.ts)
- [Script type-check config](../../../packages/core/scripts/tsconfig.json)

## Agreed public shape

Keep:

```ts
import { Button, Card } from "@basic-ui/core";
import "@basic-ui/core/styles.css";
```

Add:

```ts
import { Button, type ButtonProps } from "@basic-ui/core/Button";
import { Card, type CardProps } from "@basic-ui/core/Card";
import { TablePagination, LinkPagination } from "@basic-ui/core/Pagination";
```

Use the existing component directory casing. Pagination remains one grouped
entry for this task; do not create new top-level pagination aliases or restructure
its source directories.

Target mapping, alongside the existing explicit root/CSS/metadata exports:

```json
"./*": {
  "dev": "./src/components/*/index.ts",
  "import": {
    "types": "./dist/components/*/index.d.ts",
    "default": "./dist/components/*/index.js"
  }
}
```

Separate `dist/esm` and `dist/types` trees are unnecessary. The important contract
is that every advertised entry resolves to the correct JS and declarations.
Retain the root barrel as a convenience, not as a flattened implementation that
every component entry imports.

## Implementation sequence

### 1. Complete the public entries

- Add the missing Skeleton entry, exporting its implementation and public props.
- Add Card, Header, Image and Skeleton, with their public prop types, to the root
  component barrel. They are currently missing there.
- Export Card's public prop/component types from its own entry. Keep compound
  members and existing exports working. Avoid root-name collisions from generic
  helper types shared with Header/Image; use explicit type exports.
- Audit each component entry for its implementation and intended public types.
  Do not expose internal recipes, tests or stories as new public API.
- Select currently contains only a story, not an implementation. Do not invent a
  Select component or an entry for it.

### 2. Emit real component modules and declarations

- Configure a multi-entry ESM build using the root entry and public component
  entry files. Derive entries from the `components/<Name>/index.ts` convention
  rather than introducing a manually duplicated registry.
- Verify supported Vite 8/Rolldown options before using them. Do not assume a
  Rollup-only `preserveModules` option works. Multi-entry output with shared
  chunks is acceptable.
- Emit stable component entry paths matching the manifest above. Shared chunks
  may have hashed names; do not duplicate dependencies into standalone bundles.
- Retain React/React DOM as external dependencies, including their runtime
  subpaths. Preserve the existing remaining dependency boundaries.
- Emit matching declarations, including supporting internal types. Use a
  build-specific TS config if needed; do not ship story/test/test-utility
  declarations as part of the library build.
- Make clean/build ordering reliable: Vite must not erase declarations, and
  incremental TS state must not skip them after build output is cleaned.
- Preserve the public stylesheet and generated CSS copy behavior.
- Check declaration references resolve outside workspace aliases. Do not require
  consumers to define `@core` or other private source aliases.

### 3. Wire package resolution

- Add the wildcard mapping; keep explicit root, CSS and metadata entries.
- Align `main`, `module`, `types` and any retained `typesVersions` with actual
  output. Do not add CommonJS or legacy-TypeScript support.
- Audit import-time side effects. Use accurate package metadata, normally
  `sideEffects: ["**/*.css"]` if the audit supports it. Do not discard meaningful
  global initialization by assertion.
- `dev` is a custom resolution condition, not an automatic result of
  `NODE_ENV=development`. Opt local tooling into it explicitly and align
  TypeScript `customConditions` with local bundler conditions.
- Configure the relevant workspace development consumer, such as Storybook,
  without replacing Vite's default conditions. Source aliases may remain for
  internal authoring, but must not mask package-export validation.
- Published/default consumer builds must not activate `dev` or depend on the
  unpublished `src` directory.

### 4. Prove the public package, then document

Add small regression tests using existing Vite, TypeScript and test tooling:

1. Build from clean output, then build again. Every supported entry and
   declaration must exist on both runs.
2. Pack Core and test the extracted package through its manifest, not aliases to
   source or direct imports from `dist`. Use available workspace dependencies;
   do not introduce a new packaging/test framework.
3. Verify root and component imports for every public entry, including new
   Header/Image/Skeleton exports and Card's compound members.
4. Compile an external-style TS fixture using both root and component prop-type
   imports, with the project's supported bundler resolution and no workspace
   path aliases/custom source condition.
5. Verify an explicitly opted-in local `dev` resolution uses source, while
   default/published resolution uses built files.
6. Build equivalent Button-only consumers using root and component imports.
   Neither may retain unrelated pagination/Badge implementations. Inspect actual
   code/module retention, not display-name strings alone. Externalize React
   consistently; do not externalize Core to make the test pass.
7. Check CSS still resolves and survives production bundling. Keep the existing
   responsive CSS coverage tests passing.

Record before/after consumer sizes for the same fixtures as evidence, not as a
new benchmarking system. Do not import historical size numbers as acceptance
thresholds: adding previously missing exports changes the available API.

Keep component authoring ordinary. Do not scatter manual `/*#__PURE__*/`
annotations through source or remove display names to make this change work.
Normal build-generated annotations are fine. If module boundaries and metadata
still leave a specific retention problem, name and isolate that blocker rather
than expanding into another broad source refactor.

Document per-component imports, the local-only `dev` condition, grouped
Pagination imports and newly available exports. Add a Core changeset using the
repository's pre-1.0 versioning convention.

## Gates

Use focused regression checks first, then:

```powershell
pnpm -r --filter '@basic-ui/core...' build
pnpm --filter @basic-ui/core type-check
pnpm --filter @basic-ui/core lint
pnpm --filter @basic-ui/core exec vitest run --reporter=dot
pnpm --filter @basic-ui/core check:layout-utilities
git diff --check
```

Also validate the local consumer configuration if changed. Existing Storybook
source aliases are not proof that installed-package exports work.

Report each exact command and its result. Clean up only owned fixture/tarball
paths. Finish with changed files, the supported import forms, before/after
consumer measurements and any unresolved limitation.

## Out of scope and rollback

- No responsive vocabulary/utility-generation changes. The CSS flexibility
  discussion is unresolved and intentionally separate.
- No color/theming, Button behavior, component geometry, new components,
  headless/icons packaging migration, React API migration, or source AST tooling.
- No broad story-import rewrite, extra public subcomponent paths, new styling
  engine, or source/class scanner.
- Preserve the old root and stylesheet paths throughout: the rollout is additive.
  Check those paths alongside the new paths before considering the task complete.
- If the build experiment fails, restore only this task's build/manifest/entry
  edits and remove its owned temporary artifacts. Do not reset the branch, touch
  unrelated user work, or change CSS to compensate for a packaging problem.
