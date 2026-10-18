---
"@basic-ui/react-utilities": minor
---

Fix the published build surface of `@basic-ui/react-utilities`.

- Externalize React and React DOM including their runtime subpaths
  (`react/jsx-runtime`) instead of inlining the JSX runtime into
  `dist/index.js`. Consumers no longer bundle a duplicate React runtime when
  depending on this package (a Button-only `@basic-ui/core` consumer shrinks
  from 67,425 to 58,241 bytes minified with the dependency bundled).
- Add the missing `react-dom` peer dependency, which `Portal` requires.
- Remove the legacy `typesVersions` map; the package supports modern
  `exports`-aware resolution only, matching `@basic-ui/core`.
- Clean stale build output: rebuilt from a clean `dist`, which no longer
  contains test utilities.
