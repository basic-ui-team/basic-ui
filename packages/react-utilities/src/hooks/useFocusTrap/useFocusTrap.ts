import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe:not([disabled])",
  "[tabindex]",
  "[contenteditable='true']",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.tabIndex >= 0,
  );
}

/**
 * Module-scope stack of active trap containers, same idiom as the overlay
 * stack. Only the topmost trap handles Tab redirection so nested dialogs
 * compose: the inner trap cycles within itself, the outer one stands down.
 */
const trapStack: HTMLElement[] = [];

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
 *   the container (first focusable, or `initialFocusRef`), and marks the
 *   container's sibling subtrees — at every ancestor level up to `body` —
 *   `aria-hidden` so screen readers skip background content.
 * - While active: Tab/Shift+Tab cycle within the container. The Tab listener
 *   is attached at the document level, so focus that escapes the container
 *   (e.g. a programmatic focus or a click on a background control) is
 *   redirected back in.
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
    let restoreTabindex: (() => void) | null = null;

    const activate = (container: HTMLElement) => {
      if (cancelled) return;
      activated.current = true;
      previouslyFocused.current = document.activeElement;
      trapStack.push(container);

      // Hide the container's sibling subtrees at every ancestor level up to
      // body, so background content is hidden for portalled and inline
      // containers alike. Existing aria-hidden values are left untouched and
      // only the attributes we add are restored on deactivate.
      let node: Element | null = container;
      while (node && node !== document.body) {
        const parent: Element | null = node.parentElement;
        if (parent) {
          for (const sibling of Array.from(parent.children) as Element[]) {
            if (sibling === node || sibling.contains(container)) continue;
            if (sibling.hasAttribute("aria-hidden")) continue;
            sibling.setAttribute("aria-hidden", "true");
            hiddenSiblings.current.push(sibling);
          }
        }
        node = parent;
      }

      const focusable = getFocusableElements(container);
      const focusTarget = initialFocusRef?.current ?? focusable[0] ?? container;
      if (focusTarget === container && !container.hasAttribute("tabindex")) {
        // A plain element is not programmatically focusable; make it so for
        // the trap's lifetime and restore afterwards.
        container.setAttribute("tabindex", "-1");
        restoreTabindex = () => container.removeAttribute("tabindex");
      }
      focusTarget.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        // Nested traps: only the topmost one owns Tab redirection.
        if (trapStack[trapStack.length - 1] !== container) return;
        const focusableNow = getFocusableElements(container);
        if (focusableNow.length === 0) {
          event.preventDefault();
          container.focus();
          return;
        }
        const first = focusableNow[0];
        const last = focusableNow[focusableNow.length - 1];
        const current = document.activeElement;
        if (!container.contains(current)) {
          // Focus escaped the trap (programmatic focus, background click);
          // redirect it back in.
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
          return;
        }
        if (event.shiftKey) {
          if (current === first) {
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
      document.addEventListener("keydown", handleKeyDown);
      cleanupListener = () => document.removeEventListener("keydown", handleKeyDown);
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
      restoreTabindex?.();
      const index = trapStack.indexOf(ref.current!);
      if (index !== -1) trapStack.splice(index, 1);
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
