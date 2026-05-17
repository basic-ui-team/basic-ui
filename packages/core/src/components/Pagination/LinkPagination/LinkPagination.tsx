import React, { useMemo } from "react";
import { generatePageNumbers } from "../shared/generatePageNumbers";
import { calculatePaginationState } from "@core/lib/calculatePaginationState";
import {
  paginationVariants,
  paginationButtonVariants,
  paginationEllipsisVariants,
} from "../shared/pagination.variants.ts";
import { Icon } from "../../Icon";
import { ChevronLeftIcon, ChevronRightIcon } from "@basic-ui/icons";
import type { LinkPaginationProps } from "./linkPagination.types";

/**
 * LinkPagination
 *
 * Renders pagination as semantic links and is intended for URL-driven
 * navigation (for example, blog or listing pages). Provide `getPageHref` to
 * compute the href for each page. For client-side routing, pass a
 * `linkComponent` (e.g., Next.js `Link`).
 *
 * Accessibility: renders a `nav` with `aria-label="Pagination"` and marks
 * the active page with `aria-current="page"`.
 *
 * Example:
 * ```tsx
 * <LinkPagination pageCount={5} currentPage={2} getPageHref={(p) => `/page/${p}`} />
 * ```
 */
export const LinkPagination = React.forwardRef<HTMLDivElement, LinkPaginationProps>(
  (
    {
      totalItems,
      itemsPerPage,
      pageCount,
      currentPage,
      getPageHref,
      linkComponent: LinkComponent = "a",
      customIcons,
      showFirstLast = true,
      showPrevNext = true,
      maxSiblingButtons = 2,
      maxBoundaryButtons = 1,
      shape = "rounded",
      variant: variant = "default",
      color = "default",
      className,
      ...rest
    },
    ref,
  ) => {
    const activeCurrentPage = currentPage || 1;
    // Prefer explicit pageCount, else compute
    const totalPages =
      pageCount ?? (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1);
    const { hasPrev, hasNext } = useMemo(
      () => calculatePaginationState(totalPages, 1, activeCurrentPage),
      [totalPages, activeCurrentPage],
    );
    const clamped = (p: number) => Math.max(1, Math.min(p, totalPages));
    const pageNumbers = useMemo(
      () =>
        generatePageNumbers(activeCurrentPage, totalPages, maxSiblingButtons, maxBoundaryButtons),
      [activeCurrentPage, totalPages, maxSiblingButtons, maxBoundaryButtons],
    );
    const icons = {
      previous: customIcons?.previous || <ChevronLeftIcon />,
      next: customIcons?.next || <ChevronRightIcon />,
      first: customIcons?.first || <ChevronLeftIcon />,
      last: customIcons?.last || <ChevronRightIcon />,
    };
    if (totalPages <= 1) return null;
    return (
      <nav
        ref={ref}
        className={paginationVariants({}) + (className ? ` ${className}` : "")}
        role="navigation"
        aria-label="Pagination"
        {...rest}
      >
        {showFirstLast && (
          <LinkComponent
            href={getPageHref(clamped(1))}
            className={paginationButtonVariants({ size: "md", shape, variant, color })}
            aria-label="Go to first page"
            aria-disabled={!hasPrev}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              !hasPrev && e.preventDefault()
            }
            tabIndex={!hasPrev ? -1 : undefined}
          >
            <Icon icon={icons.first} size="md" />
          </LinkComponent>
        )}
        {showPrevNext && (
          <LinkComponent
            href={getPageHref(clamped(activeCurrentPage - 1))}
            className={paginationButtonVariants({ size: "md", shape, variant, color })}
            aria-label="Go to previous page"
            aria-disabled={!hasPrev}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              !hasPrev && e.preventDefault()
            }
            tabIndex={!hasPrev ? -1 : undefined}
          >
            <Icon icon={icons.previous} size="sm" />
          </LinkComponent>
        )}
        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <div
              key={`ellipsis-${idx}`}
              className={paginationEllipsisVariants()}
              aria-hidden="true"
            >
              …
            </div>
          ) : (
            <LinkComponent
              key={page}
              href={getPageHref(clamped(page as number))}
              className={paginationButtonVariants({
                size: "md",
                shape,
                variant,
                color,
              })}
              aria-current={page === activeCurrentPage ? "page" : undefined}
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                page === activeCurrentPage && e.preventDefault()
              }
              aria-label={`Go to page ${page}`}
              aria-disabled={page === activeCurrentPage}
              tabIndex={page === activeCurrentPage ? -1 : undefined}
            >
              {page}
            </LinkComponent>
          ),
        )}
        {showPrevNext && (
          <LinkComponent
            href={getPageHref(clamped(activeCurrentPage + 1))}
            className={paginationButtonVariants({ size: "md", shape, variant, color })}
            aria-label="Go to next page"
            aria-disabled={!hasNext}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              !hasNext && e.preventDefault()
            }
            tabIndex={!hasNext ? -1 : undefined}
          >
            <Icon icon={icons.next} size="sm" />
          </LinkComponent>
        )}
        {showFirstLast && (
          <LinkComponent
            href={getPageHref(clamped(totalPages))}
            className={paginationButtonVariants({ size: "md", shape, variant, color })}
            aria-label="Go to last page"
            aria-disabled={!hasNext}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              !hasNext && e.preventDefault()
            }
            tabIndex={!hasNext ? -1 : undefined}
          >
            <Icon icon={icons.last} size="md" />
          </LinkComponent>
        )}
      </nav>
    );
  },
);

LinkPagination.displayName = "LinkPagination";
