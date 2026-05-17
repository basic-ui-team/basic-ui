# Table Pagination

TablePagination provides accessible pagination controls for tabular data, supporting both controlled and uncontrolled usage.

```tsx
import { TablePagination } from "basic-ui/core"

// Basic example
<TablePagination pageCount={10} currentPage={1} onPageChange={setPage} />
```

## Overview

TablePagination renders a navigation bar for paginated data tables. It supports both controlled (`currentPage`) and uncontrolled (`initialPage`) usage, and notifies page changes via `onPageChange`. The component is highly customizable and integrates with theming and variants.

## When to use

- When paginating rows in a table or data grid.
- When you need accessible, keyboard-navigable pagination controls.
- Avoid for infinite-scroll or cursor-based pagination.

## Variants / Appearance

- `default` — standard appearance.
- `outlined` — outlined style for page buttons.
- `shape` — `rounded`, `square`, or `circular` page buttons.

## Examples

### Basic

```tsx
<TablePagination pageCount={5} currentPage={2} onPageChange={setPage} />
```

### Advanced

```tsx
<TablePagination
	totalItems={100}
	itemsPerPage={10}
	currentPage={page}
	onPageChange={setPage}
	showFirstLast
	showPrevNext={false}
	maxSiblingButtons={3}
	variant="outlined"
	shape="circular"
/>
```

### Controlled vs Uncontrolled

Controlled:
```tsx
const [page, setPage] = useState(1);
<TablePagination pageCount={10} currentPage={page} onPageChange={setPage} />
```

Uncontrolled:
```tsx
<TablePagination pageCount={10} initialPage={2} />
```

## API

| **Prop**           | Type                                              | Default   | Description |
|--------------------|---------------------------------------------------|-----------|-------------|
| totalItems         | `number`                                          |           | Total number of items to paginate. |
| itemsPerPage       | `number`                                          |           | Number of items per page. |
| pageCount          | `number`                                          |           | Total number of pages (overrides totalItems/itemsPerPage). |
| currentPage        | `number`                                          |           | Current active page (controlled). |
| initialPage        | `number`                                          |           | Initial page (uncontrolled). |
| customIcons        | `Partial<PageNavigationIcons>`                    |           | Custom icons for navigation buttons. |
| showFirstLast      | `boolean`                                         | `true`    | Show "First" and "Last" buttons. |
| showPrevNext       | `boolean`                                         | `true`    | Show "Previous" and "Next" buttons. |
| maxSiblingButtons  | `number`                                          | `2`       | Max page buttons adjacent to current page. |
| maxBoundaryButtons | `number`                                          | `1`       | Max page buttons at start/end. |
| shape              | `'rounded' | 'square' | 'circular'`               | `'rounded'` | Border radius style for page buttons. |
| variant            | `'default' | 'outlined'`                          | `'default'` | Style variant for page buttons. |
| color              | `'default' | 'primary' | 'secondary'`             | `'default'` | Color style for page buttons. |
| className          | `string`                                          |           | Custom class name. |
| onPageChange       | `(page: number) => void`                          |           | Callback when page changes. |

## Accessibility

- Renders a `nav` with `aria-label="Pagination"`.
- Active page button has `aria-current="page"`.
- All controls are keyboard accessible.

## Stories

- See Storybook: `TablePagination/Basic`, `TablePagination/Variants` (if present).

## Source

Source: https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/TablePagination

