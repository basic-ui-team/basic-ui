import { useMemo, useRef } from "react";
import { useDisclosure, type UseDisclosureProps } from "../useDisclosure/useDisclosure";
import { useAriaIds } from "../useId/useId";
import { useOverlay } from "../useOverlay/useOverlay";
import { useFocusTrap } from "../useFocusTrap/useFocusTrap";

export type UseDialogProps = UseDisclosureProps & {
  /** Accessible name source: a title string (recommended) — wired via aria-labelledby. */
  title?: string;
  /**
   * Dismiss on outside pointerdown. Defaults to true.
   * Set false for destructive-action dialogs that must be explicitly confirmed.
   */
  dismissOnOutside?: boolean;
  /** Block background scroll while open. Defaults to true. */
  lockScroll?: boolean;
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
    "aria-modal": true;
    "aria-labelledby": string;
    id: string;
  };
  /** Props to spread on the dialog title element. */
  titleProps: { id: string };
};

/**
 * Headless modal dialog per the WAI-ARIA APG "Dialog (Modal)" pattern.
 * Wires together the milestone-2 primitives:
 *
 * - `useDisclosure` for open/close state (controlled or uncontrolled)
 * - `useOverlay` for Escape dismissal, outside dismissal, scroll lock,
 *   and correct stacking with other overlays
 * - `useFocusTrap` for focus containment and restoration, and
 *   `aria-hidden` marking of background content
 * - `useAriaIds` for the labelledby wiring
 *
 * @example
 * const { open, onOpen, onClose, dialogProps, titleProps } = useDialog();
 * <button onClick={onOpen}>Open</button>
 * {open && (
 *   <Portal>
 *     <div {...dialogProps}>
 *       <h2 {...titleProps}>Title</h2>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   </Portal>
 * )}
 */
export function useDialog(props: UseDialogProps = {}): UseDialogResult {
  const { title: _title, dismissOnOutside, lockScroll, ...disclosureProps } = props;
  const { open, onOpen, onClose, onToggle } = useDisclosure(disclosureProps);

  const dialogRef = useRef<HTMLDivElement>(null);
  useOverlay({
    open,
    ref: dialogRef,
    onDismiss: onClose,
    dismissOnOutside,
    lockScrollWhileOpen: lockScroll,
  });
  useFocusTrap({ ref: dialogRef, enabled: open });

  const { fieldProps } = useAriaIds({ prefix: "dialog" });
  const titleId = `${fieldProps.id}-title`;

  const dialogProps = useMemo(
    () => ({
      ref: dialogRef,
      role: "dialog" as const,
      "aria-modal": true as const,
      "aria-labelledby": titleId,
      id: fieldProps.id,
    }),
    [titleId, fieldProps.id],
  );

  return {
    open,
    onOpen,
    onClose,
    onToggle,
    dialogRef,
    dialogProps,
    titleProps: { id: titleId },
  };
}
