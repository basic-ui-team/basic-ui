import React from "react";
import { cn, forwardRefWithAs, PolymorphicRef, useDisclosure } from "@basic-ui/react-utilities";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "@basic-ui/icons";
import type { AlertOwnProps, AlertProps, AlertSeverity, AllowedAlertElements } from "./alert.types";
import {
  alertVariants,
  alertTitleVariants,
  alertContentVariants,
  alertActionVariants,
  alertDismissButtonVariants,
  alertPaletteRecipe,
} from "./alert.variants";
import { Box, BoxProps } from "../Box";
import { Icon } from "../Icon";
import { cr, type PaletteColor } from "../../lib/colorRecipes/colorRecipes";

const ICON_MAP: Record<AlertSeverity, { icon: React.ComponentType; color: string }> = {
  success: { icon: CheckCircleIcon, color: "green" },
  error: { icon: XCircleIcon, color: "red" },
  warning: { icon: AlertTriangleIcon, color: "amber" },
  info: { icon: InfoIcon, color: "sky" },
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
      variant = "filled",
      color,
      icon,
      title,
      action,
      dismissible = false,
      open,
      defaultOpen = true,
      onOpenChange,
      className,
      style,
      children,
      ...props
    }: AlertProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const { open: isOpen, onClose } = useDisclosure({ open, defaultOpen, onOpenChange });

    const Comp = (as || "div") as As;
    const iconElement =
      icon === false ? null : icon ?? React.createElement(ICON_MAP[severity].icon);
    const hasActions = Boolean(action) || dismissible;

    if (!isOpen) {
      return null;
    }

    // Semantic role: alert for urgent messages, status for polite notifications
    const role = severity === "error" || severity === "warning" ? "alert" : "status";

    const effectiveColor = color ?? (ICON_MAP[severity].color as PaletteColor);
    const cooked = cr(effectiveColor, alertPaletteRecipe[variant]);

    return (
      <Box
        as={Comp}
        ref={ref}
        role={role}
        className={cn(alertVariants({ variant }), cooked?.className, className)}
        style={{ ...cooked.style, ...style }}
        {...(props as BoxProps<As>)}
      >
        {iconElement !== null && <Icon icon={iconElement} />}

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
                <Icon icon={<XIcon />} aria-hidden="true" />
              </button>
            )}
          </Box>
        )}
      </Box>
    );
  },
);

(Alert as unknown as { displayName?: string }).displayName = "Alert";
