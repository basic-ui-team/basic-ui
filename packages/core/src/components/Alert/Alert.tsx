import React, { useState } from "react";
import { cn } from "@core/lib";
import { Icon } from "../Icon";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "@basic-ui/icons";

import {
  alertVariants,
  alertTitleVariants,
  alertIconVariants,
  alertContentVariants,
  alertActionVariants,
} from "./alert.variants";
import type { AlertProps } from "./alert.types";

// Map alert severities to icon components
const ICON_MAP: Record<string, React.ComponentType> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

/**
 * Alert — Slot-based notification component
 *
 * Displays persistent inline feedback with optional title and dismissal.
 * Uses semantic slots (`title` + `description`) for composition clarity.
 *
 * Accessibility:
 * - Uses `role="alert"` for error/warning (time-sensitive)
 * - Uses `role="status"` for info/success (polite notifications)
 * - Includes semantic icons and title support
 * - Dismissible alerts include accessible close button
 *
 * @example
 * // Simple info alert (description slot)
 * <Alert description="This is an informational message" />
 *
 * // Error alert with title and dismissible
 * <Alert
 *   severity="error"
 *   title="Error"
 *   description="Something went wrong. Please try again."
 *   dismissible
 *   onDismiss={() => setShowAlert(false)}
 * />
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      severity = "info",
      borderless = false,
      icon,
      iconMap,
      title,
      action,
      onDismiss,
      isOpen = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [isDismissed, setIsDismissed] = useState(false);

    const mergedIconMap = { ...ICON_MAP, ...iconMap };
    const iconNode = icon === false ? null : icon || mergedIconMap[severity];
    const iconElement = typeof iconNode === "function" ? React.createElement(iconNode) : iconNode;




    const handleDismiss = () => {
      setIsDismissed(true);
      onDismiss?.();
    };

    // Determine if alert should be shown
    const isVisible = isOpen && !isDismissed;

    if (!isVisible) {
      return null;
    }

    // Semantic role: alert for urgent messages, status for polite notifications
    const role = severity === "error" || severity === "warning" ? "alert" : "status";

    return (
      <div
        ref={ref}
        role={role}
        className={cn(alertVariants({ severity, borderless }), className)}
        {...props}
      >
        {/* Icon */}
        <div className={alertIconVariants()}>
          {iconElement && <Icon icon={iconElement} variant={severity} size="sm" />}
        </div>

        {/* Content */}
        <div className={alertContentVariants()}>
          {title && <div className={alertTitleVariants()}>{title}</div>}
          <div>{props.children}</div>
        </div>

        <div className={alertActionVariants()}>
          {action}
          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="shrink-0 -mr-sm -my-sm p-sm hover:bg-black/5 rounded transition-colors"
              aria-label="Dismiss alert"
          >
            <Icon icon={<XIcon />} size="sm" />
          </button>
        )}
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";
