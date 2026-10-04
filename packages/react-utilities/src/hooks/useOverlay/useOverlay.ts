import { useEffect, useRef, type RefObject } from "react";

/**
 * Module-scope stack of active overlays, shared store style (same idiom as
 * useBreakpoint's listener set). The topmost entry is the only overlay
 * that Escape dismisses and the only one that owns the scroll lock.
 */
const overlayStack: symbol[] = [];
const overlayListeners = new Set<() => void>();

function notifyStack() {
  for (const listener of overlayListeners) listener();
}

let scrollLockCount = 0;
let lockedBodyPaddingRight = "";
let lockedBodyOverflow = "";

function lockScroll() {
  if (scrollLockCount === 0) {
    // Capture the page's existing inline policies so the unlock restores
    // them exactly; a page with `overflow: scroll` keeps its scrollbar setup.
    lockedBodyPaddingRight = document.body.style.paddingRight;
    lockedBodyOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `calc(${lockedBodyPaddingRight || "0px"} + ${scrollbarWidth}px)`;
    }
    document.body.style.overflow = "hidden";
  }
  scrollLockCount++;
}

function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = lockedBodyOverflow;
    document.body.style.paddingRight = lockedBodyPaddingRight;
  }
}

export type UseOverlayProps = {
  /** Whether the overlay is open. */
  open: boolean;
  /** Ref of the overlay's root element, used for outside dismissal. */
  ref: RefObject<HTMLElement | null>;
  /** Called when the overlay requests dismissal (Escape, outside pointerdown). */
  onDismiss: () => void;
  /**
   * Dismiss on outside pointerdown. Defaults to true. Non-modal overlays
   * (e.g. tooltips) may disable this while keeping the stack behavior.
   */
  dismissOnOutside?: boolean;
  /**
   * Block document scroll while open. Defaults to true for modals.
   */
  lockScrollWhileOpen?: boolean;
};

/**
 * Overlay behavior shared by dialogs, popovers, menus, and select popups:
 * a global stack where only the topmost overlay dismisses on Escape, and
 * a reference-counted scroll lock (nested modals lock once, restore once).
 *
 * Per WAI-ARIA APG "Dialog (Modal)": Escape closes; scroll is blocked while
 * open; dismissal is only ever delivered to the topmost overlay.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const { open } = useDisclosure();
 * useOverlay({ open, ref, onDismiss: onClose });
 */
export function useOverlay(props: UseOverlayProps): void {
  const { open, ref, onDismiss, dismissOnOutside = true, lockScrollWhileOpen = true } = props;

  const idRef = useRef<symbol | null>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const dismissOnOutsideRef = useRef(dismissOnOutside);
  dismissOnOutsideRef.current = dismissOnOutside;

  useEffect(() => {
    if (!open) return;
    const id = Symbol("overlay");
    idRef.current = id;
    overlayStack.push(id);
    notifyStack();

    if (lockScrollWhileOpen) lockScroll();

    const isTopmost = () => overlayStack[overlayStack.length - 1] === id;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!isTopmost()) return;
      onDismissRef.current();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopmost()) return;
      if (!dismissOnOutsideRef.current) return;
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      onDismissRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      const index = overlayStack.indexOf(id);
      if (index !== -1) overlayStack.splice(index, 1);
      idRef.current = null;
      notifyStack();
      if (lockScrollWhileOpen) unlockScroll();
    };
  }, [open, ref, lockScrollWhileOpen]);
}

/** Test helper: reset the module-scope stack between tests. */
export function resetOverlayStackForTesting() {
  overlayStack.length = 0;
  scrollLockCount = 0;
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}
