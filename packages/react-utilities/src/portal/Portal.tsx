import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  /** Content to render into the portal. */
  children: ReactNode;
  /**
   * Element to portal into. Defaults to `document.body`.
   * Ignored during SSR, where nothing is rendered.
   */
  container?: HTMLElement | null;
  /**
   * When true the children render in place instead of a portal.
   * Useful for tests and non-overlay usage.
   */
  disabled?: boolean;
};

/**
 * Render children into a DOM node outside the React tree's position —
 * the base of every overlay (dialog, popover, menu, select popup), so
 * ancestor `overflow: hidden`, `transform`, or `z-index` contexts cannot
 * clip or stack the overlay incorrectly.
 *
 * SSR-safe: renders nothing on the server; portals only attach after
 * mount, so hydration is never mismatched.
 *
 * @example
 * <Portal><div role="dialog">…</div></Portal>
 */
export function Portal({ children, container, disabled = false }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled) return <>{children}</>;

  if (!mounted || typeof document === "undefined") return null;

  const target = container ?? document.body;
  return createPortal(children, target);
}
