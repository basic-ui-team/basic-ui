import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export type AnchorSide = "top" | "bottom" | "left" | "right";
export type AnchorAlign = "start" | "center" | "end";

export type UseAnchorPositioningProps = {
  /** When true, the popup is positioned and listeners are attached. */
  enabled: boolean;
  /** Ref of the anchor element the popup attaches to. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Which side of the anchor the popup sits on. Defaults to "bottom". */
  side?: AnchorSide;
  /** Alignment along the anchor's side. Defaults to "start". */
  align?: AnchorAlign;
  /** Gap between anchor and popup in px. Defaults to 8. */
  sideOffset?: number;
  /** Minimum px between popup and viewport edges when clamping. Defaults to 8. */
  viewportPadding?: number;
};

export type UseAnchorPositioningResult = {
  /** Attach to the popup element (the portalled container). */
  popupRef: RefObject<HTMLDivElement | null>;
  /** Style to spread on the popup element. */
  style: CSSProperties;
  /** Recompute now (e.g. after content changes the popup's size). */
  update: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Position a portalled popup against an anchor element — the shared
 * positioning layer for popovers, dropdowns, tooltips, and select popups.
 *
 * - Coordinates are viewport-based (`position: fixed`), read from the
 *   anchor's `getBoundingClientRect()` — no scrollY/scrollX math.
 * - The cross axis is aligned (start/center/end) and both axes are clamped
 *   to the viewport with padding, so the popup never leaves the screen.
 *   Deliberately no flip: a collision-aware engine (floating-ui) is an
 *   explicit ADR decision, not baked in here.
 * - Recomputes on captured scroll and window resize, so overflow-ancestor
 *   scrolls keep the popup glued to its anchor (the bug appiq's Popover has).
 * - Portal content may attach a commit after the first render; positioning
 *   retries on the next animation frame until the popup element exists.
 *
 * @example
 * const anchorRef = useRef<HTMLButtonElement>(null);
 * const { popupRef, style, update } = useAnchorPositioning({
 *   enabled: open,
 *   anchorRef,
 *   side: "bottom",
 *   align: "start",
 * });
 * <button ref={anchorRef} onClick={onToggle}>Trigger</button>
 * {open && (
 *   <Portal>
 *     <div ref={popupRef} style={style}>Popup</div>
 *   </Portal>
 * )}
 */
export function useAnchorPositioning(
  props: UseAnchorPositioningProps,
): UseAnchorPositioningResult {
  const {
    enabled,
    anchorRef,
    side = "bottom",
    align = "start",
    sideOffset = 8,
    viewportPadding = 8,
  } = props;

  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", top: 0, left: 0 });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;
    const rect = anchor.getBoundingClientRect();
    const popupWidth = popup?.offsetWidth ?? 0;
    const popupHeight = popup?.offsetHeight ?? 0;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Main-axis coordinate: the side the popup sits on.
    const main =
      side === "bottom"
        ? rect.bottom + sideOffset
        : side === "top"
          ? rect.top - sideOffset - popupHeight
          : side === "right"
            ? rect.right + sideOffset
            : rect.left - sideOffset - popupWidth;
    // Cross-axis coordinate: alignment along that side.
    const cross =
      align === "start"
        ? side === "top" || side === "bottom"
          ? rect.left
          : rect.top
        : align === "end"
          ? side === "top" || side === "bottom"
            ? rect.right - popupWidth
            : rect.bottom - popupHeight
          : side === "top" || side === "bottom"
            ? rect.left + rect.width / 2 - popupWidth / 2
            : rect.top + rect.height / 2 - popupHeight / 2;

    // Clamp both axes into the viewport (no flip — an ADR decision).
    const clampedCross = clamp(
      cross,
      viewportPadding,
      Math.max(viewportPadding, viewportWidth - popupWidth - viewportPadding),
    );
    const clampedMain = clamp(
      main,
      viewportPadding,
      Math.max(viewportPadding, viewportHeight - popupHeight - viewportPadding),
    );

    setStyle({
      position: "fixed",
      ...(side === "top" || side === "bottom"
        ? { top: clampedMain, left: clampedCross }
        : { top: clampedCross, left: clampedMain }),
    });
  }, [anchorRef, side, align, sideOffset, viewportPadding]);

  useLayoutEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let cancelled = false;
    const position = () => {
      if (cancelled) return;
      update();
      if (!popupRef.current) {
        // Portal content may attach a commit later; retry next frame.
        raf = requestAnimationFrame(position);
      }
    };
    position();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [enabled, update]);

  // An ancestor's scroll moves the anchor but not a fixed popup — recompute
  // on any scroll (capture) and on resize.
  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [enabled, update]);

  return { popupRef, style, update };
}
