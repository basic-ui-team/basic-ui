import { RefObject, useEffect, useRef } from "react";
import { usePopover, UsePopoverProps } from "../usePopover/usePopover";

export type UseTooltipProps<T extends HTMLElement = HTMLElement> = Omit<
  UsePopoverProps<T>,
  "dismissOnOutside" | "hasPopup" | "role"
> & {
  /**
   * The delay in milliseconds before showing the tooltip.
   */
  delay?: number;
  /**
   * The delay in milliseconds before hiding the tooltip.
   */
  closeDelay?: number;
};

export type UseTooltipResult<T extends HTMLElement = HTMLElement> = {
  /**
   * Whether the tooltip is currently open.
   */
  open: boolean;
  /**
   * Props for the trigger element (usually the element that the tooltip is anchored to).
   */
  triggerProps: {
    "aria-describedby"?: string;
    onPointerEnter: (event: React.PointerEvent<T>) => void;
    onPointerLeave: (event: React.PointerEvent<T>) => void;
    onFocus: (event: React.FocusEvent<T>) => void;
    onBlur: (event: React.FocusEvent<T>) => void;
  };
  /**
   * Props for the tooltip element.
   */
  tooltipProps: {
    id: string;
    role: "tooltip";
    ref: RefObject<HTMLDivElement | null>;
    style: React.CSSProperties;
    onPointerEnter?: (event: React.PointerEvent<HTMLDivElement>) => void;
    onPointerLeave?: (event: React.PointerEvent<HTMLDivElement>) => void;
  };
};

/**
 * Headless tooltip hook. Provides the logic for managing tooltip visibility
 * and positioning without any UI components.
 *
 * @example
 * const anchorRef = useRef<HTMLButtonElement>(null);
 * const { triggerProps, tooltipProps, open } = useTooltip({
 *   anchorRef,
 *   delay: 500,
 *   closeDelay: 300,
 * });
 *
 * return (
 *   <>
 *     <button {...triggerProps} ref={anchorRef}>Hover me</button>
 *     {open && <div {...tooltipProps}>Tooltip content</div>}
 *   </>
 * );
 */
export function useTooltip<T extends HTMLElement = HTMLElement>(
  props: UseTooltipProps<T>,
): UseTooltipResult<T> {
  const {
    anchorRef,
    delay = 400,
    closeDelay = 200,
    side = "bottom",
    align = "center",
    sideOffset = 8,
    open: openProp,
    defaultOpen,
    dismissOnEscape,
    onOpenChange,
  } = props;

  const { open, onOpen, onClose, ...popover } = usePopover({
    anchorRef,
    side,
    align,
    sideOffset,
    viewportPadding: 8,
    dismissOnOutside: false,
    dismissOnEscape,
    role: "tooltip",
    hasPopup: undefined,
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const scheduleOpen = () => {
    clearTimers();
    openTimerRef.current = setTimeout(() => {
      onOpen();
    }, delay);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, closeDelay);
  };

  return {
    open,
    triggerProps: {
      "aria-describedby": open ? popover.popoverProps.id : undefined,
      onPointerEnter: scheduleOpen,
      onPointerLeave: scheduleClose,
      onFocus: scheduleOpen,
      onBlur: scheduleClose,
    },
    tooltipProps: {
      id: popover.popoverProps.id,
      role: "tooltip",
      ref: popover.popoverProps.ref,
      style: popover.popoverProps.style,
      onPointerEnter: clearTimers,
      onPointerLeave: scheduleClose,
    },
  };
}
