import React, { useState, forwardRef } from "react";
import { cn } from "@core/lib";
import { Icon } from "../Icon";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "@basic-ui/icons";
import type { AlertProps } from "./alert.types";
import type { PolymorphicRef } from "../../types/props";
import type { AllowedAlertElements } from "./alert.types";

import {
  alertVariants,
  alertTitleVariants,
  alertIconVariants,
  alertContentVariants,
  alertActionVariants,
} from "./alert.variants";

// Map alert severities to icon components
const ICON_MAP: Record<string, React.ComponentType> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

/**
 * Alert Component
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
 * <Alert severity="info">This is an informational message</Alert>
 *
 * // Error alert with title and dismissible
 * <Alert
 *   as="section"
 *   severity="error"
 *   title="Error"
 *   onDismiss={() => setShowAlert(false)}
 * >
 *   Something went wrong. Please try again.
 * </Alert>
 */
const _Alert = <As extends AllowedAlertElements = "div">(
  {
    as,
    severity = "info",
    borderless = false,
    icon,
    iconMap,
    title,
    action,
    onDismiss,
    isOpen = true,
    className,
    children,
    ...props
  }: AlertProps<As>,
  ref?: PolymorphicRef<As>,
) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const Comp = (as || "div") as As;
  const Child = Comp === "p" ? "span" : "div"; // Div cannot be a child of p for hydration consistency
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
    <Comp
      ref={ref}
      role={role}
      className={cn(alertVariants({ severity, borderless }), className)}
      {...(props as any)}
    >
      {/* Icon */}
      <Child className={alertIconVariants()}>
        {iconElement && <Icon icon={iconElement} variant={severity} size="sm" />}
      </Child>

      {/* Content */}
      <Child className={alertContentVariants()}>
        {title && <Child className={alertTitleVariants()}>{title}</Child>}
        <Child>{children}</Child>
      </Child>

      <Child className={alertActionVariants()}>
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
      </Child>
    </Comp>
  );
};

export const Alert = forwardRef(_Alert) as <Element extends AllowedAlertElements = 'div'>(
  props: AlertProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;

(Alert as any).displayName = "Alert"; // any cast to avoid type issues with forwardRef and generics
