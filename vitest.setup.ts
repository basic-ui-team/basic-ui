import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// `jest-axe` exports an object of matchers; pass it directly to `expect.extend`.
expect.extend(toHaveNoViolations);

/**
 * Mock window.matchMedia for responsive utilities in tests
 * Default to matching the base breakpoint (no breakpoint match)
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
