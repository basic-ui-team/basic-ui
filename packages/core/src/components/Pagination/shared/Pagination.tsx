// Shared psgination view component to be consumed by both TablePagination and LinkPagination. This is not exported directly.

import React from "react";
import { PaginationViewProps } from "./pagination.types";
import { cn } from "@core/lib";
import {
  paginationButtonVariants,
  paginationEllipsisVariants,
  paginationVariants,
} from "./pagination.variants";
import { ChevronLeftIcon, ChevronRightIcon } from "@basic-ui/icons";

export const Pagination = React.forwardRef<HTMLElement, PaginationViewProps>(
  (
    {
      totalPages,
      activePage,
      pageNumbers,
      hasPrev,
      hasNext,
      shape,
      variant,
      color,
      className,
      customIcons,
      renderPage,
      renderControl,
      handlePageChange,
      ...rest
    },
    ref,
  ) => {
    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn(paginationVariants({}), className)}
        role="navigation"
        aria-label="Pagination"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!handlePageChange) return;
          switch (e.key) {
            case "ArrowLeft":
              e.preventDefault();
              handlePageChange(activePage - 1);
              break;
            case "ArrowRight":
              e.preventDefault();
              handlePageChange(activePage + 1);
              break;
            case "Home":
              e.preventDefault();
              handlePageChange(1);
              break;
            case "End":
              e.preventDefault();
              handlePageChange(totalPages);
              break;
          }
        }}
        {...rest}
      >
        {renderControl(
          "first",
          !hasPrev,
          cn(paginationButtonVariants({ size: "md", shape, variant, color })),
          "Go to first page",
          handlePageChange ? () => handlePageChange(1) : undefined,
          customIcons?.first || <ChevronLeftIcon />,
        )}
        {renderControl(
          "prev",
          !hasPrev,
          cn(paginationButtonVariants({ size: "md", shape, variant, color })),
          "Go to previous page",
          handlePageChange ? () => handlePageChange(activePage - 1) : undefined,
          customIcons?.previous || <ChevronLeftIcon />,
        )}
        {pageNumbers.map((pageNumber, idx) =>
          pageNumber === "ellipsis" ? (
            <div
              key={`ellipsis-${idx}`}
              className={paginationEllipsisVariants()}
              aria-hidden="true"
            >
              …
            </div>
          ) : (
            renderPage(
              pageNumber,
              pageNumber === activePage,
              false,
              `Go to page ${pageNumber}`,
              handlePageChange ? () => handlePageChange(pageNumber as number) : undefined,
              pageNumber === activePage ? -1 : undefined,
              cn(
                paginationButtonVariants({
                  size: "md",
                  shape,
                  variant,
                  color,
                  active: pageNumber === activePage,
                }),
              ),
            )
          ),
        )}
        {renderControl(
          "next",
          !hasNext,
          cn(paginationButtonVariants({ size: "md", shape, variant, color })),
          "Go to next page",
          handlePageChange ? () => handlePageChange(activePage + 1) : undefined,
          customIcons?.next || <ChevronRightIcon />,
        )}
        {renderControl(
          "last",
          !hasNext,
          cn(paginationButtonVariants({ size: "md", shape, variant, color })),
          "Go to last page",
          handlePageChange ? () => handlePageChange(totalPages) : undefined,
          customIcons?.last || <ChevronRightIcon />,
        )}
      </nav>
    );
  },
);
