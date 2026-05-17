import { CommonProps } from "@core/types/props";

/** Icons used for the navigation controls (first/prev/next/last). */
export interface PageNavigationIcons {
  previous: React.ReactNode;
  next: React.ReactNode;
  first: React.ReactNode;
  last: React.ReactNode;
}

/** Props consumed by the `usePagination` hook. Kept narrow and focused on pagination logic. */
export interface usePaginationProps {
  totalItems?: number;
  itemsPerPage?: number;
  pageCount?: number;
  initialPage?: number;
  /** Current active page (1-indexed). When provided, the hook is in controlled mode. */
  currentPage?: number;
  onPageChange?: (page: number) => void;
  maxSiblingButtons?: number;
  maxBoundaryButtons?: number;
}

/**
 * Public props shared by `TablePagination` and `LinkPagination`.
 *
 * Notes:
 * - Supports controlled (`currentPage`) and uncontrolled (`initialPage`) usage.
 * - `pageCount` overrides `totalItems/itemsPerPage` when provided.
 */
export interface SharedPaginationProps extends Omit<CommonProps, "children"> {
  /** Total number of items to paginate. */
  totalItems?: number;
  /** Number of items to display per page. */
  itemsPerPage?: number;
  /** Total number of pages (overrides totalItems/itemsPerPage if provided). */
  pageCount?: number;
  /** Current active page (1-indexed). When provided the component is controlled. */
  currentPage?: number;
  /** Initial page to use for uncontrolled mode (1-indexed). */
  initialPage?: number;
  /** Custom icons for navigation buttons. Any omitted icons will use defaults. */
  customIcons?: Partial<PageNavigationIcons>;
  /** Show "First" and "Last" page navigation buttons. Defaults to `true`. */
  showFirstLast?: boolean;
  /** Show "Previous" and "Next" page navigation buttons. Defaults to `true`. */
  showPrevNext?: boolean;
  /** Maximum number of page number buttons adjacent to the current page. Defaults to 2. */
  maxSiblingButtons?: number;
  /** Maximum number of page number buttons at the start/end of the range. Defaults to 1. */
  maxBoundaryButtons?: number;
  /** Border radius style for page number buttons. Defaults to `rounded`. */
  shape?: "rounded" | "square" | "circular";
  /** Variant style for page number buttons. Defaults to `default`. */
  variant?: "default" | "outlined";
  /** Color style for page number buttons. Defaults to `default`. */
  color?: "default" | "primary" | "secondary";
  /** Handler invoked when a page number is requested. */
  onPageChange?: (page: number) => void;
}

/**
 * Props passed into the shared `Pagination` view renderer.
 * This is the contract between the pagination logic and the UI layer.
 */
export interface PaginationViewProps {
  totalPages: number;
  activePage: number;
  pageNumbers: (number | "ellipsis")[];
  hasPrev: boolean;
  hasNext: boolean;
  shape: "rounded" | "square" | "circular";
  variant: "default" | "outlined";
  color: "default" | "primary" | "secondary";
  className?: string;
  customIcons?: Partial<PageNavigationIcons>;

  /** Render function for page number buttons. */
  renderPage: (
    page: number,
    isActive: boolean,
    isDisabled?: boolean,
    ariaLabel?: string,
    onClick?: () => void,
    tabIndex?: number,
    className?: string,
  ) => React.ReactNode;

  /** Render function for navigation controls (first/prev/next/last). */
  renderControl: (
    type: "first" | "prev" | "next" | "last",
    disabled: boolean,
    className?: string,
    ariaLabel?: string,
    onClick?: () => void,
    icon?: React.ReactNode,
  ) => React.ReactNode;

  /** Handler invoked when a page number is requested. */
  handlePageChange: (page: number) => void;
}
