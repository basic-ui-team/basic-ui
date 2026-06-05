import React, { useState } from "react";
import { cn, forwardRefWithAs } from "@core/lib";
import { Icon } from "../Icon";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "@basic-ui/icons";
import type { AlertOwnProps, AlertProps } from "./alert.types";
import type { PolymorphicRef } from "../../types/props";
import type { AllowedAlertElements } from "./alert.types";

import {
  alertVariants,
  alertTitleVariants,
  alertIconVariants,
  alertContentVariants,
  alertActionVariants,
} from "./alert.variants";
import { Box } from "../Box";

// Map alert severities to icon components
const ICON_MAP: Record<string, React.ComponentType> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

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
  ref: PolymorphicRef<As>,
) => {
  const [isDismissed, setIsDismissed] = useState(false);

  let Comp = (as || "div") as As;
  const Child = Comp === "p" || Comp === "span" ? "span" : "div"; // Use inline wrappers for inline parents to avoid invalid nesting/hydration issues
  const mergedIconMap = { ...ICON_MAP, ...iconMap };
  const iconNode = icon === false ? null : icon || mergedIconMap[severity];
  const iconElement = typeof iconNode === "function" ? React.createElement(iconNode) : iconNode;

  if (ref && ref instanceof HTMLDivElement) {
    Comp = "div" as As;
    console.warn(
      "Using a div ref, forcing Alert to render as div to prevent react hydration issues. Please provide a ref compatible with the 'as' prop if you want to render a different element.",
    );
  }

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
    <Box
      as={Comp}
      ref={ref}
      role={role}
      className={cn(alertVariants({ severity, borderless }), className)}
      {...(props as any)}
    >
      {/* Icon */}
      <Box as={Child} className={alertIconVariants()}>
        {iconElement && <Icon icon={iconElement} variant={severity} size="sm" />}
      </Box>

      {/* Content */}
      <Box as={Child} className={alertContentVariants()}>
        {title && <Box className={alertTitleVariants()}>{title}</Box>}
        <Box>{children}</Box>
      </Box>

      <Box as={Child} className={alertActionVariants()}>
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
      </Box>
    </Box>
  );
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
 * // Error alert with title and dismissible
 * <Alert
 *   as="div"
 *   severity="error"
 *   title="Error"
 *   onDismiss={() => setShowAlert(false)}
 * >
 *   Something went wrong. Please try again.
 * </Alert>
 */
export const Alert = forwardRefWithAs<AlertOwnProps, AllowedAlertElements>(_Alert);

(Alert as unknown as { displayName?: string }).displayName = "Alert";
