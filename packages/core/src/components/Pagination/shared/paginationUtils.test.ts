import { describe, it, expect } from "vitest";
import { calculatePaginationState } from "./paginationUtils";

describe("calculatePaginationState", () => {
  it("clamps currentPage larger than totalPages", () => {
    const s = calculatePaginationState(50, 10, 10);
    expect(s.totalPages).toBe(5);
    expect(s.startIndex).toBe(40);
    expect(s.endIndex).toBe(49);
    expect(s.hasPrev).toBe(true);
    expect(s.hasNext).toBe(false);
  });

  it("normalizes itemsPerPage of 0 to 1", () => {
    const s = calculatePaginationState(3, 0, 2);
    expect(s.totalPages).toBe(3);
    expect(s.startIndex).toBe(1);
    expect(s.endIndex).toBe(1);
  });

  it("handles totalItems 0 gracefully", () => {
    const s = calculatePaginationState(0, 10, 1);
    expect(s.totalPages).toBe(1);
    expect(s.startIndex).toBe(0);
    expect(s.endIndex).toBe(0);
    expect(s.hasPrev).toBe(false);
    expect(s.hasNext).toBe(false);
  });
});
