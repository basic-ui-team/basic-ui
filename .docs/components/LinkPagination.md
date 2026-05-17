# Link Pagination

LinkPagination renders pagination as semantic links for URL-driven navigation, ideal for blogs or listings.

```tsx
import { LinkPagination } from "basic-ui/core";

// Basic example
<LinkPagination pageCount={5} currentPage={2} getPageHref={(p) => `/page/${p}`} />;
```

## Overview

LinkPagination renders a navigation bar with links for each page. It is designed for use cases where navigation is URL-based. You must provide `getPageHref` to generate the target URL for each page. Supports custom link components for client-side routing.

## When to use

- When paginating blog posts, product listings, or any URL-driven content.
- When you want semantic links for SEO and accessibility.
- Avoid for purely client-side pagination without URLs.

## Variants / Appearance

- `default` — standard appearance.
- `outlined` — outlined style for page buttons.
- `shape` — `rounded`, `square`, or `circular` page buttons.

## Examples

### Basic

```tsx
<LinkPagination pageCount={5} currentPage={2} getPageHref={(p) => `/page/${p}`} />
```

### Custom Link Component

```tsx
<LinkPagination
  pageCount={10}
  currentPage={1}
  getPageHref={(p) => `/blog/page/${p}`}
  linkComponent={NextLink}
/>
```

## API

| **Prop**           | Type                           | Default     | Description                                                |
| ------------------ | ------------------------------ | ----------- | ---------------------------------------------------------- | 
| totalItems         | `number`                       |             | Total number of items to paginate.                         |
| itemsPerPage       | `number`                       |             | Number of items per page.                                  |
| pageCount          | `number`                       |             | Total number of pages (overrides totalItems/itemsPerPage). |
| currentPage        | `number`                       |             | Current active page (controlled).                          |
| customIcons        | `Partial<PageNavigationIcons>` |             | Custom icons for navigation buttons.                       |
| showFirstLast      | `boolean`                      | `true`      | Show "First" and "Last" buttons.                           |
| showPrevNext       | `boolean`                      | `true`      | Show "Previous" and "Next" buttons.                        |
| maxSiblingButtons  | `number`                       | `2`         | Max page buttons adjacent to current page.                 |
| maxBoundaryButtons | `number`                       | `1`         | Max page buttons at start/end.                             |
| shape              | `'rounded'                     | 'square'    | 'circular'`                                                | `'rounded'`                     | Border radius style for page buttons. |
| variant            | `'default'                     | 'outlined'` | `'default'`                                                | Style variant for page buttons. |
| color              | `'default'                     | 'primary'   | 'secondary'`                                               | `'default'`                     | Color style for page buttons.         |
| className          | `string`                       |             | Custom class name.                                         |
| getPageHref        | `(page: number) => string`     |             | Function to generate href for a given page. **(required)** |
| linkComponent      | `React.ElementType`            | `'a'`       | Custom link component (e.g., Next.js Link).                |

## Accessibility

- Renders a `nav` with `aria-label="Pagination"`.
- Active page link has `aria-current="page"`.
- All controls are keyboard accessible and semantic links for SEO.

## Stories

- See Storybook: `LinkPagination/Basic`, `LinkPagination/Variants` (if present).

## Source

Source: https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/LinkPagination
