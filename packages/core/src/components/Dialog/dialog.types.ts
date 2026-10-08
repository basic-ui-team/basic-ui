import { CommonProps, RestrictedPropsWithAs, UseDisclosureProps } from "@basic-ui/react-utilities";

export type AllowedDialogElements = "div" | "section";

export interface DialogOwnProps extends CommonProps {
  /** Controlled open state. When omitted, the dialog is uncontrolled. */
  open?: UseDisclosureProps["open"];

  /** Initial open state for uncontrolled usage. @default false */
  defaultOpen?: UseDisclosureProps["defaultOpen"];

  /** Called with the next open state, in both controlled and uncontrolled modes. */
  onOpenChange?: UseDisclosureProps["onOpenChange"];

  /**
   * Dialog heading, rendered inside the dialog's header.
   *
   * Accepts any ReactNode so callers can embed custom markup; the node is
   * rendered inside a heading element wired via `titleProps`, so the
   * dialog's `aria-labelledby` resolves to it. Plain strings are the
   * common case.
   */
  title?: React.ReactNode;

  /**
   * Optional supporting text rendered directly below the title.
   *
   * Wired to the dialog container via `aria-describedby`, so screen readers
   * announce it as part of the dialog's description. Omit when not needed;
   * when provided, it is always rendered inside a non-heading element
   * (e.g. `<p>`), so use text-level markup inside it.
   */
  description?: React.ReactNode;

  /**
   * Accessible name for the dialog when no `title` is rendered. Falls back to
   * the hook's `aria-label` wiring so `role="dialog"` is never unnamed.
   */
  "aria-label"?: string;

  /**
   * Id of an external element that labels the dialog when no `title` is
   * rendered. Overrides the generated `aria-labelledby` wiring.
   */
  "aria-labelledby"?: string;

  /** Expand to the available width, up to the dialog's maximum width. @default false */
  fullWidth?: boolean;

  /**
   * Controls the dialog's maximum width.
   * @default "md"
   */
  size?: DialogSize;

  /** The footer content of the dialog. e.g., action buttons */
  footer?: React.ReactNode;

  /** Show the close button in the dialog header. @default true */
  showClose?: boolean;

  /**
   * Modal mode: focus trap, scroll lock, aria-modal, Escape and
   * outside dismissal. When false, renders a non-modal dialog
   * @default true
   */
  modal?: boolean;

  /**
   * Close the dialog when clicking outside of it. Defaults to true, for both
   * modal and non-modal dialogs; set false for destructive-action dialogs
   * that must be explicitly confirmed.
   */
  dismissOnOutside?: boolean;

  /**
   * Block background scroll while open. Defaults to the `modal` setting, so
   * background scroll stays available in non-modal dialogs unless explicitly
   * enabled.
   */
  lockScroll?: boolean;
}

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps<As extends AllowedDialogElements = "div"> = RestrictedPropsWithAs<
  DialogOwnProps,
  As
>;
