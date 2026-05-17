import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, setupUser } from "../../../test-utils";
import { LinkPagination } from "./LinkPagination";

describe("LinkPagination", () => {
  it("does not render when only one page", () => {
    const { container } = renderWithProviders(
      <LinkPagination pageCount={1} currentPage={1} getPageHref={() => "#"} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders links with hrefs from getPageHref and marks current page", () => {
    renderWithProviders(
      <LinkPagination pageCount={5} currentPage={2} getPageHref={(p) => `/page/${p}`} />,
    );

    // check a normal page link
    const p3 = screen.getByLabelText("Go to page 3");
    expect(p3).toHaveAttribute("href", "/page/3");

    // current page should have aria-current and be aria-disabled
    const current = screen.getByLabelText("Go to page 2");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("aria-disabled", "true");
    expect(current).toHaveAttribute("tabindex", "-1");
  });

  it("disables prev/first on first page and next/last on last page", () => {
    const { rerender } = renderWithProviders(
      <LinkPagination pageCount={5} currentPage={1} getPageHref={(p) => `/${p}`} />,
    );

    expect(screen.getByLabelText("Go to first page")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText("Go to previous page")).toHaveAttribute("aria-disabled", "true");

    rerender(<LinkPagination pageCount={5} currentPage={5} getPageHref={(p) => `/${p}`} />);
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText("Go to last page")).toHaveAttribute("aria-disabled", "true");
  });

  it("accepts a custom LinkComponent and passes href prop", () => {
    const received: Array<Record<string, any>> = [];

    const CustomLink: React.FC<any> = ({ href, children, ...props }) => {
      received.push({ href, props });
      return (
        <a data-testid={"custom-link-" + href} href={href} {...props}>
          {children}
        </a>
      );
    };

    renderWithProviders(
      <LinkPagination
        pageCount={3}
        currentPage={1}
        getPageHref={(p) => `/p/${p}`}
        linkComponent={CustomLink}
      />,
    );

    // ensure our custom link received the href for page 2 and the page link is correctly rendered
    expect(received.some((r) => r.href === "/p/2")).toBeTruthy();
    expect(screen.getByLabelText("Go to page 2")).toHaveAttribute("href", "/p/2");
  });

  it("clamps generated hrefs to valid page range", () => {
    // start with page 1 and use rerender to update the same container
    const { rerender } = renderWithProviders(
      <LinkPagination pageCount={5} currentPage={1} getPageHref={(p) => `/${p}`} />,
    );
    expect(screen.getByLabelText("Go to first page")).toHaveAttribute("href", "/1");
    expect(screen.getByLabelText("Go to previous page")).toHaveAttribute("href", "/1");
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute("href", "/2");
    expect(screen.getByLabelText("Go to last page")).toHaveAttribute("href", "/5");

    // when on last page, next should clamp to last page
    rerender(<LinkPagination pageCount={5} currentPage={5} getPageHref={(p) => `/${p}`} />);
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute("href", "/5");
    expect(screen.getByLabelText("Go to previous page")).toHaveAttribute("href", "/4");

    rerender(<LinkPagination pageCount={5} currentPage={3} getPageHref={(p) => `/${p}`} />);
    // page buttons should be valid
    expect(screen.getByLabelText("Go to page 3")).toHaveAttribute("href", "/3");
  });

  it("prevents default on clicks for disabled navigation links", async () => {
    const events: Array<{ href: string; defaultPrevented: boolean }> = [];

    const CustomLink: React.FC<any> = ({ href, children, onClick, ...props }) => (
      // capture defaultPrevented after LinkPagination's onClick is invoked
      <a
        href={href}
        onClick={(e) => {
          onClick?.(e);
          events.push({ href: String(href), defaultPrevented: e.defaultPrevented });
        }}
        {...props}
      >
        {children}
      </a>
    );

    const { rerender } = renderWithProviders(
      <LinkPagination
        pageCount={3}
        currentPage={1}
        getPageHref={(p) => `/p/${p}`}
        linkComponent={CustomLink}
      />,
    );

    const user = setupUser();
    await user.click(screen.getByLabelText("Go to previous page"));
    // previous is disabled on page 1 so click should have been prevented
    expect(events.some((e) => e.href === "/p/1" && e.defaultPrevented)).toBeTruthy();

    await user.click(screen.getByLabelText("Go to first page"));
    // first is disabled on page 1 so click should have been prevented
    expect(events.some((e) => e.href === "/p/1" && e.defaultPrevented)).toBeTruthy();

    rerender(
      <LinkPagination
        pageCount={3}
        currentPage={3}
        getPageHref={(p) => `/p/${p}`}
        linkComponent={CustomLink}
      />,
    );

    await user.click(screen.getByLabelText("Go to next page"));
    // next is disabled on last page so click should have been prevented
    expect(events.some((e) => e.href === "/p/3" && e.defaultPrevented)).toBeTruthy();

    await user.click(screen.getByLabelText("Go to last page"));
    // last is disabled on last page so click should have been prevented
    expect(events.some((e) => e.href === "/p/3" && e.defaultPrevented)).toBeTruthy();
  });

  it("prevents the user from navigating to the current page", async () => {
    const events: Array<{ href: string; defaultPrevented: boolean }> = [];

    const CustomLink: React.FC<any> = ({ href, children, onClick, ...props }) => (
      // capture defaultPrevented after LinkPagination's onClick is invoked
      <a
        href={href}
        onClick={(e) => {
          onClick?.(e);
          events.push({ href: String(href), defaultPrevented: e.defaultPrevented });
        }}
        {...props}
      >
        {children}
      </a>
    );

    renderWithProviders(
      <LinkPagination
        pageCount={3}
        currentPage={2}
        getPageHref={(p) => `/p/${p}`}
        linkComponent={CustomLink}
      />,
    );

    const user = setupUser();
    await user.click(screen.getByLabelText("Go to page 2"));
    // current page link should prevent navigation
    expect(events.some((e) => e.href === "/p/2" && e.defaultPrevented)).toBeTruthy();
  });
});
