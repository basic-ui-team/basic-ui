import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

export type UseFocusTrapProps = {
  /** Ref of the container to trap focus within. */
  ref: RefObject<HTMLElement | null>;
  /** When true, the trap is active. Defaults to true. */
  enabled?: boolean;
  /**
   * Focus this element when the trap activates. Defaults to the first
   * focusable element inside the container.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Restore focus to the previously focused element when the trap deactivates. Defaults to true. */
  restoreFocus?: boolean;
};

/**
 * Trap keyboard focus within a container while active (WAI-ARIA APG
 * "Dialog (Modal)" — focus management):
 *
 * - On activation: stores the currently focused element, moves focus into
 *   the container (first focusable, or `initialFocusRef`), and marks
 *   sibling subtrees `aria-hidden` so screen readers skip them.
 * - While active: Tab/Shift+Tab cycle within the container.
 * - On deactivation: removes the aria marks and restores focus to the
 *   element focused before activation.
 *
 * Portal content may attach a commit after the effect first runs, so the
 * trap retries on the next animation frame when the ref is not yet attached.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useFocusTrap({ ref, enabled: open });
 */
export function useFocusTrap(props: UseFocusTrapProps): void {
  const { ref, enabled = true, initialFocusRef, restoreFocus = true } = props;

  const previouslyFocused = useRef<Element | null>(null);
  const hiddenSiblings = useRef<Element[]>([]);
  const activated = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let cleanupListener: (() => void) | null = null;

    const activate = (container: HTMLElement) => {
      if (cancelled) return;
      activated.current = true;

      previouslyFocused.current = document.activeElement;

      // Hide sibling subtrees from assistive tech so only the overlay is read.
      for (const child of Array.from(document.body.children)) {
        if (child.contains(container)) continue;
        if (child.hasAttribute("aria-hidden")) continue;
        child.setAttribute("aria-hidden", "true");
        hiddenSiblings.current.push(child);
      }

      const focusTarget =
        initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
      focusTarget.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        const focusable = getFocusableElements(container);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (event.shiftKey) {
          if (current === first || !container.contains(current)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (current === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      container.addEventListener("keydown", handleKeyDown);
      cleanupListener = () => container.removeEventListener("keydown", handleKeyDown);
    };

    const container = ref.current;
    let raf = 0;
    if (container) {
      activate(container);
    } else {
      // Portal content may attach a commit later; retry next frame.
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) activate(el);
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupListener?.();
      if (activated.current) {
        for (const el of hiddenSiblings.current) {
          el.removeAttribute("aria-hidden");
        }
        hiddenSiblings.current = [];
        if (restoreFocus && previouslyFocused.current instanceof HTMLElement) {
          previouslyFocused.current.focus();
        }
        activated.current = false;
      }
    };
  }, [enabled, ref, initialFocusRef, restoreFocus]);
}
