import { useCallback } from "react";
import { useControllableState } from "../useControllableState/useControllableState";

export type UseDisclosureProps = {
  /** Controlled open state. When provided, the disclosure is controlled. */
  open?: boolean;
  /** Initial open state for the uncontrolled mode. Defaults to false. */
  defaultOpen?: boolean;
  /** Called with the next open state, in both modes. */
  onOpenChange?: (open: boolean) => void;
};

export type UseDisclosureResult = {
  /** Current open state. */
  open: boolean;
  /** Open the disclosure. No-op when already open. */
  onOpen: () => void;
  /** Close the disclosure. No-op when already closed. */
  onClose: () => void;
  /** Toggle the disclosure. */
  onToggle: () => void;
  /** Set the open state directly. */
  setOpen: (open: boolean) => void;
};

/**
 * Disclosure state (open/closed) with controlled and uncontrolled modes,
 * the foundation for dialogs, popovers, menus, and selects.
 *
 * @example
 * const { open, onOpen, onClose, onToggle } = useDisclosure();
 */
export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureResult {
  const { open: openProp, defaultOpen = false, onOpenChange } = props;

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const onOpen = useCallback(() => {
    if (!open) setOpen(true);
  }, [open, setOpen]);

  const onClose = useCallback(() => {
    if (open) setOpen(false);
  }, [open, setOpen]);

  const onToggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return { open, onOpen, onClose, onToggle, setOpen };
}
