import type React from "react";

type MessageSeverity = "success" | "error" | "warning" | "info";

/**
 * Alert — Slot-based notification component
 *
 * Composes into two semantic content slots: `title` (optional heading) and `description` (required message).
 * Replaces role-based `children` naming with explicit slot props for clarity.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Alert type/severity — determines color and icon semantics. @default "info" */
  severity?: MessageSeverity;

  /** Removes the default border and adjusts padding for a more compact look. @default false */
  borderless?: boolean;

  /** Alert title/heading text. Optional. Rendered above description. */
  title?: React.ReactNode;

  /** Alert message content. Semantic slot for the main message (required). */
  description: React.ReactNode;

  /** Whether the alert can be dismissed by the user. @default false */
  dismissible?: boolean;

  /** Callback fired when the alert is dismissed (only when dismissible={true}) */
  onDismiss?: () => void;

  /** Whether the alert content is currently visible. Use to control dismissal. @default true */
  isOpen?: boolean;
}
