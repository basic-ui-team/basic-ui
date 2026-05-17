import React from "react";
import { usePagination } from "../shared/usePagination.tsx";
import { Pagination } from "../shared/Pagination.tsx";
import { Icon } from "../../Icon";
import type { TablePaginationProps } from "./tablePagination.types";

/**
 * TablePagination
 *
 * Table/data-grid style pagination control. Use when the parent component
 * manages which data slice is displayed. Supports controlled usage via
 * `currentPage` + `onPageChange`, or uncontrolled usage with `initialPage`.
 *
 * Accessibility: renders a `nav` element with `aria-label="Pagination"` and
 * provides appropriate `aria-current` on the active page buttons.
 *
 * Example:
 * ```tsx
 * // Controlled
 * <TablePagination pageCount={20} currentPage={page} onPageChange={setPage} />
 * // Uncontrolled
 * <TablePagination pageCount={8} initialPage={2} />
 * ```
 */
export const TablePagination = React.forwardRef<HTMLElement, TablePaginationProps>(
  (
    {
      totalItems,
      itemsPerPage,
      pageCount,
      currentPage,
      onPageChange,
      customIcons,
      showFirstLast = true,
      showPrevNext = true,
      maxSiblingButtons = 2,
      maxBoundaryButtons = 1,
      shape = "rounded",
      variant: variant = "default",
      color = "default",
      className,
      initialPage,
      ...rest
    },
    ref,
  ) => {
    const { totalPages, activeCurrentPage, pageNumbers, hasPrev, hasNext, handlePageChange } =
      usePagination({
        totalItems,
        itemsPerPage,
        pageCount,
        currentPage,
        onPageChange,
        initialPage,
        maxSiblingButtons,
        maxBoundaryButtons,
      });
    const renderControl = (
      type: "first" | "prev" | "next" | "last",
      disabled: boolean,
      className?: string,
      ariaLabel?: string,
      onClick?: () => void,
      icon?: React.ReactNode,
    ) => {
      if ((type === "first" || type === "last") && !showFirstLast) return null;
      if ((type === "prev" || type === "next") && !showPrevNext) return null;

      return (
        <button
          key={`control-${type}`}
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-disabled={disabled}
          className={className}
        >
          <Icon icon={icon} size={type === "prev" || type === "next" ? "sm" : "md"} />
        </button>
      );
    };

    const renderPage = (
      page: number,
      isActive: boolean,
      isDisabled?: boolean,
      ariaLabel?: string,
      onClick?: () => void,
      tabIndex?: number | undefined,
      className?: string,
    ) => {
      return (
        <button
          key={page}
          onClick={onClick}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          className={className}
          aria-current={isActive ? "page" : undefined}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
          type="button"
        >
          {page}
        </button>
      );
    };

    return (
      <Pagination
        ref={ref}
        totalPages={totalPages}
        activePage={activeCurrentPage}
        pageNumbers={pageNumbers}
        hasPrev={hasPrev}
        hasNext={hasNext}
        shape={shape}
        variant={variant}
        color={color}
        className={className}
        renderPage={renderPage}
        renderControl={renderControl}
        handlePageChange={handlePageChange}
        customIcons={customIcons}
        {...rest}
      />
    );
  },
);

TablePagination.displayName = "TablePagination";
