import React from "react";
import { cn, forwardRefWithAs, PolymorphicRef, useDisclosure } from "@basic-ui/react-utilities";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "@basic-ui/icons";
import type { AlertOwnProps, AlertProps, AlertSeverity, AllowedAlertElements } from "./alert.types";

import {
  alertVariants,
  alertTitleVariants,
  alertIconVariants,
  alertContentVariants,
  alertActionVariants,
  alertDismissButtonVariants,
} from "./alert.variants";
import { Box } from "../Box";
import { Icon } from "../Icon";

// Map alert severities to icon components
const ICON_MAP: Record<AlertSeverity, React.ComponentType> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

/**
 * Alert Component
 *
 * Displays persistent inline feedback with optional title, icon, and dismissal.
 * The alert content is provided via `children`. An optional `title` prop can be used for a heading.
 *
 * Accessibility:
 * - Uses `role="alert"` for error/warning (time-sensitive)
 * - Uses `role="status"` for info/success (polite notifications)
 * - Includes semantic icons and title support
 * - Dismissible alerts include accessible close button
 *
 * @example
 * // Simple info alert
 * <Alert severity="info">This is an informational message</Alert>
 *
 * // Controlled, dismissible error alert
 * <Alert
 *   severity="error"
 *   title="Error"
 *   open={showAlert}
 *   onOpenChange={setShowAlert}
 *   dismissible
 * >
 *   Something went wrong. Please try again.
 * </Alert>
 */
export const Alert = forwardRefWithAs<AlertOwnProps, AllowedAlertElements>(
  <As extends AllowedAlertElements = "div">(
    {
      as,
      severity = "info",
      variant = "subtle",
      icon,
      title,
      action,
      dismissible = false,
      open,
      defaultOpen = true,
      onOpenChange,
      className,
      children,
      ...props
    }: AlertProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const { open: isOpen, onClose } = useDisclosure({ open, defaultOpen, onOpenChange });

    const Comp = (as || "div") as As;
    const iconElement = icon === false ? null : icon ?? React.createElement(ICON_MAP[severity]);
    const hasActions = Boolean(action) || dismissible;

    if (!isOpen) {
      return null;
    }

    // Semantic role: alert for urgent messages, status for polite notifications
    const role = severity === "error" || severity === "warning" ? "alert" : "status";

    return (
      <Box
        as={Comp}
        ref={ref}
        role={role}
        className={cn(alertVariants({ severity, variant }), className)}
        {...(props as any)}
      >
        {iconElement !== null && <Icon icon={iconElement} className={alertIconVariants()} />}

        <Box as="div" className={alertContentVariants()}>
          {title && <Box className={alertTitleVariants()}>{title}</Box>}
          <Box>{children}</Box>
        </Box>

        {hasActions && (
          <Box as="div" className={alertActionVariants()}>
            {action}
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                className={alertDismissButtonVariants()}
                aria-label="Dismiss alert"
              >
                <Icon icon={<XIcon />} size="sm" aria-hidden="true" />
              </button>
            )}
          </Box>
        )}
      </Box>
    );
  },
);

(Alert as unknown as { displayName?: string }).displayName = "Alert";
