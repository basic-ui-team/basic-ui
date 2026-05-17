# Pagination

This document covers both `TablePagination` and `LinkPagination`. It documents the common API and behavior, then highlights the Link-specific additions.

## Overview

`Pagination` components render accessible page controls for navigating paged content. Use `TablePagination` when the parent controls which data slice is shown (table/data-grid UX). Use `LinkPagination` when pages are URL-driven and semantic links are required (blogs, listings).

Both components:

- Render a `nav` with `aria-label="Pagination"`.
- Support controlled (`currentPage` + `onPageChange`) and uncontrolled (`initialPage`) modes.
- Expose keyboard navigation (ArrowLeft/ArrowRight/Home/End) and apply `aria-current="page"` to the active page.

## Examples

### Table (controlled)

```tsx
import { TablePagination } from "@basic-ui/core";
const [page, setPage] = useState(1);
<TablePagination pageCount={10} currentPage={page} onPageChange={setPage} />;
```

### Link

```tsx
import { LinkPagination } from "@basic-ui/core";
<LinkPagination pageCount={5} currentPage={2} getPageHref={(p) => `/page/${p}`} />;
```

## Common API

| Prop                 | Type                                    | Default     | Description                                                                      |
| -------------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `totalItems`         | `number`                                |             | Total number of items to paginate.                                               |
| `itemsPerPage`       | `number`                                |             | Number of items per page.                                                        |
| `pageCount`          | `number`                                |             | Total number of pages (overrides `totalItems/itemsPerPage`).                     |
| `currentPage`        | `number`                                |             | Current active page (controlled). Pages are 1-indexed.                           |
| `initialPage`        | `number`                                |             | Initial page for uncontrolled mode.                                              |
| `customIcons`        | `Partial<PageNavigationIcons>`          |             | Custom icons for navigation controls.                                            |
| `showFirstLast`      | `boolean`                               | `true`      | Show "First" and "Last" buttons.                                                 |
| `showPrevNext`       | `boolean`                               | `true`      | Show "Previous" and "Next" buttons.                                              |
| `maxSiblingButtons`  | `number`                                | `2`         | Max page buttons adjacent to current page.                                       |
| `maxBoundaryButtons` | `number`                                | `1`         | Max page buttons at start/end.                                                   |
| `shape`              | `'rounded' \| 'square' \| 'circular'`   | `'rounded'` | Border radius style for page buttons.                                            |
| `variant`            | `'default' \| 'outlined'`               | `'default'` | Visual variant for page buttons.                                                 |
| `color`              | `'default' \| 'primary' \| 'secondary'` | `'default'` | Color style for page buttons.                                                    |
| `className`          | `string`                                |             | Custom class name applied to the root `nav`.                                     |
| `onPageChange`       | `(page: number) => void`                |             | Callback invoked when page changes (useful for controlled mode or side-effects). |

Notes:

- Pages are 1-indexed. Components will clamp out-of-range values. Passing `0` will be clamped to `1` (a warning is emitted during development).
- When `totalItems === 0`, pagination will render nothing (no pages).

## LinkPagination (additional props)

`LinkPagination` builds semantic anchors for each page. In addition to the common API it exposes:

| Prop            | Type                       | Default      | Description                                       |
| --------------- | -------------------------- | ------------ | ------------------------------------------------- |
| `getPageHref`   | `(page: number) => string` | **required** | Function to generate the `href` for a given page. |
| `linkComponent` | `React.ElementType`        | `'a'`        | Custom link component (e.g., Next.js `Link`).     |

When you don't need `onPageChange`: basic anchor navigation or client-side `linkComponent`s handle navigation via `href` and router integration. `onPageChange` is optional and intended for side-effects (analytics, prefetching, scroll/focus management, etc.). Keyboard navigation (Home/End/Arrow keys) invokes the pagination handlers directly — `onPageChange` is useful to respond to those events as well.

## TablePagination (notes)

`TablePagination` is intended for cases where the parent manages the data slice. Provide `onPageChange` to update the table's current page. If you use uncontrolled mode, pass `initialPage`.

## Accessibility

- `nav` has `aria-label="Pagination"`.
- Active page control uses `aria-current="page"`.
- The root `nav` is focusable and supports keyboard shortcuts (ArrowLeft, ArrowRight, Home, End).

## Advanced: `usePagination` hook

We also export the `usePagination` hook for advanced use-cases where you want to render custom UI while reusing the library's pagination logic.

- Export: `import { usePagination } from "@basic-ui/core"`.
- Purpose: calculates `totalPages`, `activeCurrentPage`, `pageNumbers`, `hasPrev`, `hasNext`, and `handlePageChange` so you can implement a custom renderer.
- Example:

```tsx
const { totalPages, activeCurrentPage, pageNumbers, hasPrev, hasNext, handlePageChange } =
  usePagination({ totalItems, itemsPerPage, pageCount, currentPage, onPageChange });

// custom rendering using `pageNumbers` and `handlePageChange`
```

Notes:

- The hook is optional — you don't need it to use `TablePagination` or `LinkPagination`.
- Pages are 1-indexed; the hook clamps out-of-range values and emits a development warning if `0` is passed.
- Recommended for advanced integrations (custom layouts, non-standard markup, or to integrate with a bespoke router). Do not duplicate navigation behavior (anchors + programmatic routing) unless intentionally overriding default link behavior.

## Source

See the implementations in `packages/core/src/components/Pagination`.
