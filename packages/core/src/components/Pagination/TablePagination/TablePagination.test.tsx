import { renderWithProviders, screen, setupUser } from "../../../test-utils";
import { describe, it, expect, vi } from "vitest";
import { TablePagination } from "./TablePagination";

describe("TablePagination", () => {
  it("does not render when only one page", () => {
    const { container } = renderWithProviders(
      <TablePagination pageCount={1} currentPage={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders navigation when more than one page", () => {
    renderWithProviders(<TablePagination pageCount={5} currentPage={1} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("calls onPageChange when controlled and clicking a page", async () => {
    const user = setupUser();
    const onPageChange = vi.fn();
    renderWithProviders(<TablePagination pageCount={5} currentPage={1} onPageChange={onPageChange} />);
    await user.click(screen.getByLabelText("Go to page 3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
    // Controlled: component should not update active page by itself
    expect(screen.getByLabelText("Go to page 1")).toHaveAttribute("aria-current", "page");
  });

  it("updates internal state when uncontrolled and clicking pages", async () => {
    const user = setupUser();
    renderWithProviders(<TablePagination pageCount={5} initialPage={2} />);
    // initial active is page 2
    expect(screen.getByLabelText("Go to page 2")).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByLabelText("Go to page 4"));
    // internal state should update to 4
    expect(screen.getByLabelText("Go to page 4")).toHaveAttribute("aria-current", "page");
  });

  it("sets initial page to 1 if currentPage is invalid and initialPage is not provided", () => {
    renderWithProviders(<TablePagination pageCount={5} currentPage={-1} />);
    expect(screen.getByLabelText("Go to page 1")).toHaveAttribute("aria-current", "page");
  });

  it("clamps currentPage to valid range when controlled", () => {
    const onPageChange = vi.fn();
    const { rerender } = renderWithProviders(
      <TablePagination pageCount={5} currentPage={10} onPageChange={onPageChange} />,
    );
    // should clamp to page 5
    expect(screen.getByLabelText("Go to page 5")).toHaveAttribute("aria-current", "page");
    rerender(<TablePagination pageCount={5} currentPage={0} onPageChange={onPageChange} />);
    // should clamp to page 1
    expect(screen.getByLabelText("Go to page 1")).toHaveAttribute("aria-current", "page");
  });

  it("clamps internal state to valid range when uncontrolled and totalPages changes", () => {
    const { rerender } = renderWithProviders(<TablePagination pageCount={5} initialPage={3} />);
    expect(screen.getByLabelText("Go to page 3")).toHaveAttribute("aria-current", "page");
    rerender(<TablePagination pageCount={2} initialPage={3} />);
    // should clamp to page 2
    expect(screen.getByLabelText("Go to page 2")).toHaveAttribute("aria-current", "page");
  });

  it("disables prev/first on first page and next/last on last page", () => {
    const onPageChange = vi.fn();
    // first page
    const { rerender } = renderWithProviders(
      <TablePagination pageCount={5} currentPage={1} onPageChange={onPageChange} />,
    );
    expect(screen.getByLabelText("Go to first page")).toBeDisabled();
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();

    // last page
    rerender(<TablePagination pageCount={5} currentPage={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
    expect(screen.getByLabelText("Go to last page")).toBeDisabled();
  });

  it("respects pageCount override when totalItems/itemsPerPage omitted", () => {
    renderWithProviders(<TablePagination pageCount={8} initialPage={1} />);
    expect(screen.getByLabelText("Go to page 8")).toBeInTheDocument();
  });

  it("respects totalItems and itemsPerPage to calculate pageCount when pageCount is not provided", () => {
    renderWithProviders(<TablePagination totalItems={45} itemsPerPage={10} initialPage={1} />);
    expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to page 6")).not.toBeInTheDocument();
  });

  it("calls onPageChange for prev/next/first/last buttons when enabled", async () => {
    const user = setupUser();
    const onPageChange = vi.fn();
    renderWithProviders(<TablePagination pageCount={5} currentPage={3} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText("Go to first page"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByLabelText("Go to previous page"));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByLabelText("Go to next page"));
    expect(onPageChange).toHaveBeenCalledWith(4);

    await user.click(screen.getByLabelText("Go to last page"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("passes className to the root element", () => {
    renderWithProviders(
      <TablePagination pageCount={5} currentPage={1} onPageChange={() => {}} className="test-class" />,
    );
    expect(screen.getByRole("navigation")).toHaveClass("test-class");
    });
});
