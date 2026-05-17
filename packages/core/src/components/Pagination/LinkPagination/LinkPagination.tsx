import React from "react";
import { Icon } from "../../Icon";
import type { LinkPaginationProps } from "./linkPagination.types";
import { usePagination } from "../shared/usePagination.tsx";
import { Pagination } from "../shared/Pagination.tsx";
import { clamp } from "../shared/paginationUtils.ts";

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
export const LinkPagination = React.forwardRef<
  HTMLElement,
  Omit<LinkPaginationProps, "initialPage">
>(
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
    const { totalPages, activeCurrentPage, pageNumbers, hasPrev, hasNext, handlePageChange } =
      usePagination({
        totalItems,
        itemsPerPage,
        pageCount,
        currentPage,
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

      const href =
        type === "first"
          ? getPageHref(1)
          : type === "prev"
          ? getPageHref(clamp(activeCurrentPage - 1, 1, totalPages))
          : type === "next"
          ? getPageHref(clamp(activeCurrentPage + 1, 1, totalPages))
          : getPageHref(totalPages);

      const handleAnchorClick: React.MouseEventHandler = (e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.();
      };

      return (
        <LinkComponent
          key={`control-${type}`}
          href={href}
          onClick={handleAnchorClick}
          aria-label={ariaLabel}
          className={className}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
        >
          <Icon icon={icon} size={type === "prev" || type === "next" ? "sm" : "md"} />
        </LinkComponent>
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
      const href = getPageHref(clamp(page, 1, totalPages));
      const effectiveTabIndex = isDisabled || isActive ? -1 : tabIndex;

      const handleAnchorClick: React.MouseEventHandler = (e) => {
        if (isDisabled || isActive) {
          e.preventDefault();
          return;
        }
        onClick?.();
      };

      return (
        <LinkComponent
          key={page}
          href={href}
          aria-label={ariaLabel}
          onClick={handleAnchorClick}
          tabIndex={effectiveTabIndex}
          className={className}
          aria-disabled={isDisabled || isActive}
          aria-current={isActive ? "page" : undefined}
        >
          {page}
        </LinkComponent>
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

LinkPagination.displayName = "LinkPagination";
