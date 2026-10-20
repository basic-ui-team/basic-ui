import type React from "react";
import type { CommonProps, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import type { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

export type AlertSeverity = "success" | "error" | "warning" | "info";
export type AlertVariant = "subtle" | "filled" | "outline";

export interface AlertOwnProps extends CommonProps {
  /** Alert type/severity — determines color and icon semantics. @default "info" */
  severity?: AlertSeverity;

  /** Alert visual style variant. @default "subtle" */
  variant?: AlertVariant;

  /** Palette family for the alert's colors. Overrides the default color derived from the severity. */
  color?: PaletteColor;

  /** Custom icon for the alert. Set to `false` to disable the icon. */
  icon?: React.ReactNode | false;

  /** Alert title/heading text. Optional. Rendered above description. */
  title?: React.ReactNode;

  /** Custom action element to be rendered within the alert. */
  action?: React.ReactNode;

  /** Whether the alert renders a button that allows the user to close it. @default false */
  dismissible?: boolean;

  /** Controlled open state of the alert. */
  open?: boolean;

  /** Uncontrolled default open state of the alert. */
  defaultOpen?: boolean;

  /** Callback fired when the open state of the alert changes. */
  onOpenChange?: (open: boolean) => void;
}

export type AllowedAlertElements = "div" | "section";

export type AlertProps<As extends AllowedAlertElements = "div"> = RestrictedPropsWithAs<
  AlertOwnProps,
  As
>;
