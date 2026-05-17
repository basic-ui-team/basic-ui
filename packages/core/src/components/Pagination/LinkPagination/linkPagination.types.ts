import { SharedPaginationProps } from "../shared/sharedProps";

/**
 * Props for `LinkPagination`.
 *
 * `LinkPagination` renders semantic links for each page and is suited for
 * URL-driven navigation (for example blog pages). Provide `getPageHref` to
 * generate the target URL for each page. You may pass a `linkComponent` (such
 * as Next.js `Link`) to integrate with client-side routing.
 */
export interface LinkPaginationProps extends SharedPaginationProps {
  /** Function to generate href for a given page. */
  getPageHref: (page: number) => string;
  /** Custom link component (e.g., Next.js Link). Defaults to 'a'. */
  linkComponent?: React.ElementType;
}
