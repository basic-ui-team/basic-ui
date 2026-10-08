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
  open: boolean;
  triggerProps: {
    "aria-describedby"?: string;
    onPointerEnter?: (event: React.PointerEvent<T>) => void;
    onPointerLeave?: (event: React.PointerEvent<T>) => void;
    onFocus?: (event: React.FocusEvent<T>) => void;
    onBlur?: (event: React.FocusEvent<T>) => void;
  };
  tooltipProps: {
    id: string;
    role: "tooltip";
    ref: RefObject<HTMLDivElement | null>;
    style: React.CSSProperties;
    onPointerEnter?: (event: React.PointerEvent<HTMLDivElement>) => void;
    onPointerLeave?: (event: React.PointerEvent<HTMLDivElement>) => void;
  };
};

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
    onOpenChange,
  } = props;

  const { open, onOpen, onClose, ...popover } = usePopover({
    anchorRef,
    side,
    align,
    sideOffset,
    viewportPadding: 8,
    dismissOnOutside: false,
    dismissOnEscape: true,
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
