# Core Package Exports and Build Design

## Purpose

This document describes how `@basic-ui/core` exposes components, produces its
published `dist` files, and supports consumers that want to keep their
application bundles small. It records the package contract and the reasoning
behind the current build shape so that future changes can be evaluated against
them.

The design is additive: the root entry remains a convenient public API, while
component subpaths provide direct entry points. A subpath is a useful boundary
for consumers and tooling, but it is not by itself a guarantee of a smaller
bundle. The consumer's bundler, the component dependency graph, and stylesheet
imports still determine what is ultimately included.

## Public import contract

The supported forms are:

```ts
// Convenient aggregate API; static exports allow capable bundlers to
// remove unused JavaScript exports.
import { Button, Card } from "@basic-ui/core";
import type { ButtonProps } from "@basic-ui/core";

// Direct component entry points; prefer these when an explicit boundary is
// useful or when validating an individual component's dependency graph.
import { Button } from "@basic-ui/core/Button";
import type { ButtonProps } from "@basic-ui/core/Button";
import { TablePagination, LinkPagination } from "@basic-ui/core/Pagination";

// Styles are an explicit, separate package import.
import "@basic-ui/core/styles.css";
```

Component names use the casing of their source directories. Pagination is a
grouped entry: both pagination variants are exported from
`@basic-ui/core/Pagination`. The public surface consists of the root, the
component entries, the stylesheet, and `package.json`; implementation files
inside a component directory are not public subpaths.

The root API is backed by `src/index.ts` and the component barrel. It is kept
for convenience and compatibility. It should contain only intentional public
exports and must remain statically analyzable; avoid runtime export registries,
dynamic loading, or side-effectful barrel initialization.

## Package resolution

The `exports` map in `packages/core/package.json` is the source of truth for
supported package paths. Its relevant shape is:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "dev": "./src/index.ts",
    "import": "./dist/index.js"
  },
  "./styles.css": "./dist/styles.css",
  "./package.json": "./package.json",
  "./*": {
    "types": "./dist/components/*/index.d.ts",
    "dev": "./src/components/*/index.ts",
    "import": "./dist/components/*/index.js"
  }
}
```

For example, the wildcard maps `@basic-ui/core/Button` to the public
`components/Button/index` entry in source during opted-in local development,
and to the corresponding JavaScript and declaration files under `dist` for
package consumers.

`dev` is a custom export condition. It is not selected merely because a process
is in development mode. Local tools that intentionally resolve workspace
source must opt into it, and TypeScript configuration must agree with those
tools. Published consumers should not enable `dev`: source files are not
included in the package, and the default `import` target is built output.
Workspace aliases can be useful for authoring, but they must not be used to
claim that a packed package's exports work.

The legacy `main`, `module`, and `types` fields continue to point at the root
build for tools that consult them. Keep them aligned with the actual output;
the `exports` map remains the path-level contract.

## Source and output layout

Each public component has one stable entry at:

```text
packages/core/src/components/<Name>/index.ts
```

That entry owns the component's public runtime and type exports. It may re-export
implementation files within the component directory, but must not expose
stories, tests, fixtures, or internal-only helpers.

The Vite library build uses the root entry plus entries discovered from the
component directory convention. The resulting package layout is conceptually:

```text
packages/core/dist/
  index.js
  index.d.ts
  components/
    Button/
      index.js
      index.d.ts
    Card/
      index.js
      index.d.ts
    ...
  chunks/                 # shared build output, if generated
  styles.css
  generated/
    layout-utilities.generated.css
```

The build is an ESM library build. Entry paths are stable to match the export
map; shared implementation chunks may be emitted separately and can have
generated names. Consumers must resolve package entries rather than depend on
private chunk names or internal `dist` paths.

The Core build pipeline is:

1. Generate layout utility source from its canonical inputs.
2. Run the Vite multi-entry ESM build for the root and component entries.
3. Run the build TypeScript configuration to emit declarations.
4. Copy the public stylesheet and generated CSS into `dist`.

Build ordering matters. In particular, a build clean step must not leave stale
declarations or erase declarations emitted by TypeScript. The package build
script is the supported way to produce a complete `dist`; running only Vite
does not produce the complete package.

Only `dist` is published through the package's `files` allowlist. Keep every
target in `exports`, along with declaration references and generated CSS, inside
that published surface.

## Bundle-size design

The package is structured to enable efficient consumption without producing a
separate fully bundled dependency copy for every component:

1. **Direct component entries.** A consumer can start from a single component
   entry rather than the aggregate root. This makes the requested public entry
   explicit and simplifies dependency-graph inspection.
2. **Static ESM exports.** Both the root barrel and component entries use normal
   ESM imports and exports. Production bundlers can follow those edges and
   eliminate unused exports when their dependency graph is side-effect-safe.
3. **Shared build chunks.** Multi-entry output can share implementation between
   entries instead of duplicating it into every component file. Do not force
   standalone bundles or inline shared dependencies just to make entry files
   appear self-contained.
4. **External runtime dependencies.** React and React DOM (including their
   subpaths), Tailwind CSS, and `@basic-ui/react-utilities` are external to the
   Core library build. Keep peer/runtime dependency declarations consistent
   with these boundaries. Review any change to the external list against
   installation and consumer-resolution behavior.
5. **Separate CSS contract.** Global styles are imported explicitly through
   `@basic-ui/core/styles.css`. Package metadata marks CSS as side-effectful so
   bundlers do not discard an intentionally imported stylesheet. Do not import
   the global stylesheet implicitly from every component entry.
6. **Accurate side-effect metadata.** The current `sideEffects` declaration
   identifies CSS files. Preserve any meaningful JavaScript initialization if
   introduced; do not rely on a broad purity assertion to obtain smaller
   output.

Subpath imports do not automatically make a component smaller than a
tree-shakeable root import. A component can still pull in its transitive
dependencies, and a consumer bundler may retain unused code if modules have
side effects or are not analyzed for production. Conversely, shared chunks in
the library build are not necessarily extra bytes in a consumer's final bundle:
the consumer bundler resolves and optimizes the full graph. Avoid promising a
size saving based only on the number or size of emitted entry files.

Icons and tokens should be assessed through the actual resolved dependency
graph when their build wiring changes. In particular, verify whether imports
remain selective and whether an entry accidentally retains unrelated
components, icon assets, or token data. Do not add manual pure annotations or
remove runtime behavior solely to influence reported size without proving a
specific retention problem.

## Maintaining the contract

When adding or changing a public component:

- Add or update `src/components/<Name>/index.ts` with deliberate component and
  public type exports.
- Ensure the root component barrel exports the component if it belongs in the
  aggregate API.
- Confirm the directory entry is included in the multi-entry build and resolves
  through the wildcard package export.
- Keep JavaScript, declaration, stylesheet, and generated-asset output paths
  consistent with the package manifest and the published `files` list.
- Update package-export checks and consumer-facing documentation when the
  supported import form or public surface changes.

Do not add a second manual list of component entry points unless the convention
can no longer describe the API. If the convention changes, update discovery,
package mapping, declaration output, and regression checks together.

## Verification and size evidence

The focused package check is:

```powershell
pnpm --filter @basic-ui/core verify:package
```

It builds twice, packs and extracts the package, exercises runtime imports
through the package manifest, and compiles an external-style TypeScript fixture.
This helps catch missing entry files, stale declarations, and workspace-alias
masking. Run it when changing package exports, build configuration, or public
component entries.

For bundle-size-sensitive changes, add or update a consumer-level comparison
that:

- Builds production consumers with the same bundler settings and externalizes
  React consistently.
- Compares root and component-subpath imports using the same component and
  application setup.
- Checks retained modules or code, not display-name strings alone.
- Includes relevant CSS imports and measures the final consumer output, not just
  the library's uncompressed `dist` entry files.
- Records reproducible before/after results. Treat measurements as evidence for
  that fixture and toolchain, not a universal size guarantee.

The package verification script does not by itself prove a bundle-size
improvement. If no consumer-level measurement is available, report that
limitation rather than infer a saving from the existence of component
subpaths.
