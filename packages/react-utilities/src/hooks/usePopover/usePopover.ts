import type { CSSProperties, RefObject } from "react";
import {
  useAnchorPositioning,
  UseAnchorPositioningProps,
} from "../useAnchorPositioning/useAnchorPositioning";
import { useDisclosure, type UseDisclosureProps } from "../useDisclosure/useDisclosure";
import { useOverlay } from "../useOverlay/useOverlay";
import { useId } from "../useId/useId";

const ARIA_HASPOPUP_OPTIONS = ["menu", "listbox", "tree", "grid", "dialog", "true"] as const;

export type UsePopoverProps<T extends HTMLElement = HTMLElement> = UseDisclosureProps &
  Omit<UseAnchorPositioningProps, "enabled" | "anchorRef"> & {
    anchorRef: RefObject<T | null>;
    /**
     * Dismiss on outside pointerdown. Defaults to true (popover behavior).
     * false = tooltip-style persistence.
     */
    dismissOnOutside?: boolean;
    /**
     * Dismiss on Escape when this popover is topmost. Defaults to true.
     */
    dismissOnEscape?: boolean;
    /**
     * Value for the anchor's aria-haspopup. Defaults to "dialog".
     * Dropdown passes "menu", Select "listbox".
     */
    hasPopup?: (typeof ARIA_HASPOPUP_OPTIONS)[number];
    /**
     * Value for the popover element's role. Defaults to "dialog".
     * Consumers may override via popoverProps spread if they need something else.
     */
    role?: string;
  };

/**
 * Headless non-modal popover primitive: open/close state, anchor positioning,
 * and stacked dismissal (Escape + outside pointerdown, topmost only) —
 * the shared layer for popovers, dropdown menus, and select popups.
 *
 * Composes useDisclosure (visibility), useAnchorPositioning (placement),
 * and useOverlay (stack discipline; scroll never locks — non-modal by design).
 *
 * @example
 * const anchorRef = useRef<HTMLButtonElement>(null);
 * const { open, onToggle, anchorProps, popoverProps } = usePopover({ anchorRef });
 * <button {...anchorProps} onClick={onToggle} />
 * {open && <Portal><div {...popoverProps}>...</div></Portal>}
 */
export type UsePopoverResult<T extends HTMLElement = HTMLElement> = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  /** Props for the anchor element. Spread these on the anchor element. */
  anchorProps: {
    ref: RefObject<T | null>;
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-haspopup": (typeof ARIA_HASPOPUP_OPTIONS)[number];
  };
  /** Props for the popover element. Spread these on the portalled popover container. */
  popoverProps: {
    ref: RefObject<HTMLDivElement | null>;
    id: string;
    role: string;
    style: CSSProperties;
  };
  /** re-exposed from useAnchorPositioning. Updates the popover's position. */
  update: () => void;
};

export function usePopover<T extends HTMLElement>(props: UsePopoverProps<T>): UsePopoverResult<T> {
  const { dismissOnOutside, dismissOnEscape, hasPopup, role } = props;

  const { open, onOpen, onClose, onToggle } = useDisclosure({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  });

  const { popupRef, style, update } = useAnchorPositioning({
    enabled: open,
    anchorRef: props.anchorRef,
    side: props.side,
    align: props.align,
    sideOffset: props.sideOffset,
    viewportPadding: props.viewportPadding,
  });

  useOverlay({
    open,
    ref: popupRef,
    anchorRef: props.anchorRef,
    onDismiss: onClose,
    dismissOnOutside,
    dismissOnEscape,
    lockScrollWhileOpen: false,
  });

  const id = useId("popover");

  return {
    open,
    onOpen,
    onClose,
    onToggle,
    anchorProps: {
      ref: props.anchorRef,
      "aria-expanded": open,
      "aria-controls": id,
      "aria-haspopup": hasPopup ?? "dialog",
    },
    popoverProps: {
      ref: popupRef,
      id,
      role: role ?? "dialog",
      style,
    },
    update,
  };
}
