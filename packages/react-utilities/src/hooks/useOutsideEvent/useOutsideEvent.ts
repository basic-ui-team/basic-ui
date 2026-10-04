import { useEffect, type RefObject } from "react";

export type UseOutsideEventProps = {
  /** Ref of the element considered "inside". Events on it do not trigger callbacks. */
  ref: RefObject<HTMLElement | null>;
  /** Called on pointerdown outside the element. */
  onOutsidePointerDown?: (event: PointerEvent) => void;
  /** Called on Escape keydown. */
  onEscape?: (event: KeyboardEvent) => void;
  /** When false, no listeners are attached. Defaults to true. */
  enabled?: boolean;
};

/**
 * Outside-pointerdown and Escape dismissal for overlays (dialogs, popovers,
 * menus, selects). Listeners are attached once, on document, only while
 * enabled, so many overlays can share it cheaply.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOutsideEvent({ ref, onOutsidePointerDown: close, onEscape: close, enabled: open });
 */
export function useOutsideEvent(props: UseOutsideEventProps): void {
  const { ref, onOutsidePointerDown, onEscape, enabled = true } = props;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(event.target as Node)) return;
      onOutsidePointerDown?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape?.(event);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, onOutsidePointerDown, onEscape, enabled]);
}
