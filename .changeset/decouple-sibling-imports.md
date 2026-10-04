---
"@basic-ui/core": patch
---

Decouple Button, Alert and Pagination from sibling-component imports per the component composition rule (#60).

- Button: loading state no longer renders `Spinner`/`Flex`/`Text` internally — the loader layout and spinner glyph are inlined via `buttonLoaderVariants`/`buttonSpinnerVariants` with identical markup behavior (`role="status"` and `aria-label` preserved); rendering output is unchanged for consumers
- Alert and Pagination: the `Icon` wrapper is no longer used internally; severity and chevron glyphs render directly from `@basic-ui/icons` with the same sizing (`sm` → `w-lg h-lg`, `md` → `w-xl h-xl`) and color inheritance
- No public API changes
