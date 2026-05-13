import React, { useMemo } from "react";
import { calculatePaginationState, cn } from "@core/lib";
import { Icon } from "../Icon";
import {
  paginationVariants,
  paginationButtonVariants,
  paginationEllipsisVariants,
} from "./pagination.variants";
import { generatePageNumbers } from "./lib/generatePageNumbers";
import type { PaginationProps } from "./pagination.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@basic-ui/icons";

/**
 * Pagination
 *
 * Displays a set of navigation controls for paginated content.
 * A controlled component that delegates state to the parent via onPageChange.
 *
 * **Architecture:**
 * This component works with the usePagination hook via a shared utility:
 * - Use `calculatePaginationState` for calculations (totalPages, indices, navigation flags)
 * - Use `usePagination` hook when you need state management and data slicing (with startIndex/endIndex)
 * - Use `Pagination` component for controlled UI rendering without state
 *
 * **Data Slicing Pattern:**
 * If you need to slice data for pagination, use the hook directly:
 * ```tsx
 * const { startIndex, endIndex, totalPages } = usePagination({ totalItems, itemsPerPage, initialPage });
 * const slicedData = data.slice(startIndex, endIndex + 1);
 * ```
 *
 * @example
 * // Controlled pagination with parent data management
 * const [currentPage, setCurrentPage] = useState(1);
 * const allData = [...]; // from API/store
 * const { startIndex, endIndex } = usePagination({ totalItems: allData.length, itemsPerPage: 10, initialPage: currentPage });
 * const displayData = allData.slice(startIndex, endIndex + 1);
 *
 * <Pagination
 *   totalItems={allData.length}
 *   itemsPerPage={10}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 * />
 *
 * @example
 * // With customization
 * <Pagination
 *   totalItems={200}
 *   itemsPerPage={20}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 *   showFirstLast
 *   maxSiblingButtons={1}
 * />
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      totalItems,
      itemsPerPage,
      currentPage,
      onPageChange,
      icons: customIcons,
      showFirstLast = true,
      showPrevNext = true,
      maxSiblingButtons = 2,
      maxBoundaryButtons = 1,
      shape = "rounded",
      className,
    },
    ref,
  ) => {
    const icons = {
      previous: customIcons?.previous || <ChevronLeftIcon />,
      next: customIcons?.next || <ChevronRightIcon />,
      first: customIcons?.first || <ChevronLeftIcon />,
      last: customIcons?.last || <ChevronRightIcon />,
    };

    // Use shared utility for consistent calculations (must be before early returns)
    const { totalPages, hasPrev, hasNext } = useMemo(
      () => calculatePaginationState(totalItems, itemsPerPage, currentPage),
      [totalItems, itemsPerPage, currentPage],
    );

    // Memoize page numbers generation to avoid recalculation on every render (must be before early returns)
    const pageNumbers = useMemo(
      () => generatePageNumbers(currentPage, totalPages, maxSiblingButtons, maxBoundaryButtons),
      [currentPage, totalPages, maxSiblingButtons, maxBoundaryButtons],
    );

    if (totalPages <= 1) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(paginationVariants(), className)}
        role="navigation"
        aria-label="Pagination"
      >
        {/* First button */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={!hasPrev}
            className={cn(
              paginationButtonVariants({
                size: "md",
                shape,
                variant: "default",
              }),
            )}
            aria-label="Go to first page"
          >
            {<Icon icon={icons.first} size="md" />}
          </button>
        )}

        {/* Previous button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className={cn(
              paginationButtonVariants({
                size: "md",
                shape,
                variant: "default",
              }),
            )}
            aria-label="Go to previous page"
          >
            {<Icon icon={icons.previous} size="sm" />}
          </button>
        )}

        {/* Page number buttons */}
        {pageNumbers.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <div
                key={`ellipsis-${idx}`}
                className={paginationEllipsisVariants()}
                aria-hidden="true"
              >
                …
              </div>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                paginationButtonVariants({
                  size: "md",
                  shape,
                  variant: isActive ? "active" : "default",
                }),
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className={cn(
              paginationButtonVariants({
                size: "md",
                shape,
                variant: "default",
              }),
            )}
            aria-label="Go to next page"
          >
            {<Icon icon={icons.next} size="sm" />}
          </button>
        )}

        {/* Last button */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNext}
            className={cn(
              paginationButtonVariants({
                size: "md",
                shape,
                variant: "default",
              }),
            )}
            aria-label="Go to last page"
          >
            {<Icon icon={icons.last} size="md" />}
          </button>
        )}
      </div>
    );
  },
);

Pagination.displayName = "Pagination";
