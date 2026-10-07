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

  /** Expand to the available width, up to the dialog's maximum width. @default false */
  fullWidth?: boolean;

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

  /** Close the dialog when clicking outside of it. Modal only. @default true */
  dismissOnOutside?: boolean;

  /** Block background scroll while open. @default true */
  lockScroll?: boolean;
}

export type DialogProps<As extends AllowedDialogElements = "div"> = RestrictedPropsWithAs<
  DialogOwnProps,
  As
>;
