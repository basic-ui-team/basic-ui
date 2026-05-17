import { useMemo, useState, useEffect } from "react";
import type { usePaginationProps } from "./pagination.types";
import { calculatePaginationState, clamp, generatePageNumbers } from "./paginationUtils";

export function usePagination({
  totalItems,
  itemsPerPage,
  pageCount,
  initialPage,
  currentPage,
  onPageChange,
  maxSiblingButtons = 2,
  maxBoundaryButtons = 1,
}: usePaginationProps) {
  if (currentPage === 0 || initialPage === 0) {
    // Don't throw in runtime — clamp/normalize instead. Warn developers about 0-indexed usage.
    // Tests and some consumers may pass 0 accidentally; prefer a soft warning and clamp behavior.
    // eslint-disable-next-line no-console
    console.warn(
      "usePagination: currentPage and initialPage should be 1-indexed. Received 0 — value will be clamped to 1.",
    );
  }

  if (totalItems !== undefined && itemsPerPage !== undefined && pageCount !== undefined) {
    console.warn(
      "usePagination: You provided totalItems, itemsPerPage, and pageCount. pageCount will take precedence over totalItems/itemsPerPage.",
    );
  }

  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(() =>
    typeof currentPage === "number" && currentPage > 0 ? currentPage : initialPage || 1,
  );
  if (totalItems === 0) totalItems = 1; // Ensure at least 1 page when there are no items

  const isControlled = typeof currentPage === "number";

  const { totalPages, hasPrev, hasNext } = calculatePaginationState(
    totalItems as number,
    itemsPerPage ?? 1,
    isControlled ? (currentPage as number) : internalCurrentPage,
    pageCount,
  );

  const activeCurrentPage = isControlled
    ? clamp((currentPage as number) || 1, 1, totalPages)
    : internalCurrentPage;

  // if uncontrolled, ensure internal state stays within new totalPages when it changes
  useEffect(() => {
    if (!isControlled) {
      setInternalCurrentPage((prev) => clamp(prev, 1, totalPages));
    }
  }, [totalPages, isControlled]);

  const pageNumbers = useMemo(
    () => generatePageNumbers(activeCurrentPage, totalPages, maxSiblingButtons, maxBoundaryButtons),
    [activeCurrentPage, totalPages, maxSiblingButtons, maxBoundaryButtons],
  );

  const handlePageChange = (page: number) => {
    const newPage = clamp(page, 1, totalPages);
    if (!isControlled) {
      setInternalCurrentPage(newPage);
    }
    onPageChange?.(newPage);
  };

  return {
    totalPages,
    activeCurrentPage,
    pageNumbers,
    hasPrev,
    hasNext,
    handlePageChange,
  };
}
