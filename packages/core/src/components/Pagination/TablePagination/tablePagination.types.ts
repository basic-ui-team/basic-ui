import { SharedPaginationProps } from "../shared/pagination.types";

/**
 * Props for `TablePagination`.
 *
 * `TablePagination` is intended for table/data-grid style pagination where the
 * parent typically controls which slice of data is shown. It supports both
 * controlled (`currentPage`) and uncontrolled (`initialPage`) usage. Use
 * `onPageChange` to receive page change notifications in controlled scenarios.
 */
export interface TablePaginationProps extends SharedPaginationProps {}
