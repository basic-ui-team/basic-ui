import type React from "react";
import type { CommonProps, RestrictedPropsWithAs } from "../../types/props";

type MessageSeverity = "success" | "error" | "warning" | "info";

/**
 * Alert — Slot-based notification component
 *
 * Composes into two semantic content slots: `title` (optional heading) and `description` (required message).
 * Replaces role-based `children` naming with explicit slot props for clarity.
 */
type AlertOwnProps = {
  /** Alert type/severity — determines color and icon semantics. @default "info" */
  severity?: MessageSeverity;

  /** Removes the default border and adjusts padding for a more compact look. @default false */
  borderless?: boolean;

  /** Custom icon for the alert. Set to `false` to disable the icon. */
  icon?: React.ReactNode | false;

  /** Optional mapping of severity levels to custom icons. Overrides default icons when provided. */
  iconMap?: Partial<Record<MessageSeverity, React.ReactNode>>;

  /** Alert title/heading text. Optional. Rendered above description. */
  title?: React.ReactNode;

  /** Custom action element to be rendered within the alert. */
  action?: React.ReactNode;

  /** Callback fired when the alert is dismissed. If provided, the alert becomes dismissible. */
  onDismiss?: () => void;

  /** Whether the alert content is currently visible. Use to control dismissal. @default true */
  isOpen?: boolean;
} & CommonProps;

export type AllowedAlertElements = 'div' | 'span' | 'p';

export type AlertProps<As extends AllowedAlertElements = 'div'> = RestrictedPropsWithAs<AlertOwnProps, As>;
