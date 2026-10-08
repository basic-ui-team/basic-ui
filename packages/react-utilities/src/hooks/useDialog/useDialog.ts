import { useMemo, useRef } from "react";
import { useDisclosure, type UseDisclosureProps } from "../useDisclosure/useDisclosure";
import { useAriaIds } from "../useId/useId";
import { useOverlay } from "../useOverlay/useOverlay";
import { useFocusTrap } from "../useFocusTrap/useFocusTrap";

export type UseDialogProps = UseDisclosureProps & {
  /**
   * Accessible name for the dialog. When provided, it is wired via
   * `aria-label`; otherwise the consumer must render the title element
   * (spreading `titleProps`) so `aria-labelledby` resolves.
   */
  title?: string;
  /**
   * Whether the dialog is modal. Defaults to true. Non-modal dialogs do not
   * trap focus or lock scrolling unless `lockScroll` is explicitly enabled.
   */
  modal?: boolean;
  /**
   * Dismiss on outside pointerdown. Defaults to true.
   * Set false for destructive-action dialogs that must be explicitly confirmed.
   */
  dismissOnOutside?: boolean;
  /** Override background scroll locking. Defaults to the `modal` setting. */
  lockScroll?: boolean;
  /** Whether the rendered dialog includes a description. Defaults to false. */
  hasDescription?: boolean;
};

export type UseDialogResult = {
  /** Current open state. */
  open: boolean;
  /** Open the dialog. */
  onOpen: () => void;
  /** Close the dialog (also used by the overlay's dismissal requests). */
  onClose: () => void;
  /** Toggle the dialog. */
  onToggle: () => void;
  /** Ref for the dialog's rendered container element. */
  dialogRef: React.RefObject<HTMLDivElement | null>;
  /** Props to spread on the dialog container element (id, role, aria wiring). */
  dialogProps: {
    ref: React.RefObject<HTMLDivElement | null>;
    role: "dialog";
    "aria-modal": boolean;
    "aria-labelledby"?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    id: string;
  };
  /** Props to spread on the dialog title element. */
  titleProps: { id: string };
  /** Props to spread on the dialog description element. */
  descriptionProps: { id: string };
};

/**
 * Headless dialog, modal by default, per the WAI-ARIA APG dialog patterns.
 * Wires together the milestone-2 primitives:
 *
 * - `useDisclosure` for open/close state (controlled or uncontrolled)
 * - `useOverlay` for Escape dismissal, outside dismissal, scroll lock,
 *   and correct stacking with other overlays
 * - `useFocusTrap` for modal focus containment, restoration, and background
 *   `aria-hidden` marking
 * - `useAriaIds` for the labelledby wiring
 *
 * @example
 * const { open, onOpen, onClose, dialogProps, titleProps } = useDialog();
 * <button onClick={onOpen}>Open</button>
 * {open && (
 *   <Portal>
 *     <div {...dialogProps}>
 *       <h2 {...titleProps}>Title</h2>
 *       <p {...descriptionProps}>Description</p>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   </Portal>
 * )}
 */
export function useDialog(props: UseDialogProps = {}): UseDialogResult {
  const {
    title,
    modal = true,
    dismissOnOutside = true,
    lockScroll,
    hasDescription = false,
    ...disclosureProps
  } = props;
  const { open, onOpen, onClose, onToggle } = useDisclosure(disclosureProps);

  const dialogRef = useRef<HTMLDivElement>(null);
  useOverlay({
    open,
    ref: dialogRef,
    onDismiss: onClose,
    dismissOnOutside,
    lockScrollWhileOpen: lockScroll ?? modal,
  });
  useFocusTrap({ ref: dialogRef, enabled: open && modal });

  const { fieldProps } = useAriaIds({ prefix: "dialog" });
  const titleId = `${fieldProps.id}-title`;
  const descriptionId = `${fieldProps.id}-description`;

  const dialogProps = useMemo(() => {
    const baseProps = {
      ref: dialogRef,
      role: "dialog" as const,
      "aria-modal": modal,
      id: fieldProps.id,
    };
    const descriptionProps = hasDescription ? { "aria-describedby": descriptionId } : {};

    if (title) {
      return {
        ...baseProps,
        "aria-label": title,
        ...descriptionProps,
      };
    }
    return {
      ...baseProps,
      "aria-labelledby": titleId,
      ...descriptionProps,
    };
  }, [title, titleId, descriptionId, fieldProps.id, modal, hasDescription]);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
    dialogRef,
    dialogProps,
    titleProps: { id: titleId },
    descriptionProps: { id: descriptionId },
  };
}
