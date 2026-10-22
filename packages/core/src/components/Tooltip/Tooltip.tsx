import React, { useRef } from "react";
import { cn, Portal, useTooltip } from "@basic-ui/react-utilities";
import { Box } from "../Box";
import { TooltipProps } from "./tooltip.types";
import { tooltipVariants } from "./tooltip.variants";

/**
 * Tooltip component for displaying a lightweight floating label anchored to a
 * trigger element.
 *
 * Uses the headless 'useTooltip'hook to provide functionality.
 * See hook for behaviour.
 *
 * Features:
 * - Opens on hover after `delay`, on focus immediately enough for keyboard
 *   users, and closes after `closeDelay` (WCAG 1.4.13)
 * - Stays open while the pointer rests on the tooltip panel
 * - `role="tooltip"` + `aria-describedby` wiring from the hook; any
 *   description IDs already on the trigger are preserved
 * - Dismissible with Escape by default
 * - A consistent surface style that can be customized with `className`
 *
 * @example
 * <Tooltip label="Save changes">
 *   <button>Save</button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  side = "bottom",
  align = "center",
  sideOffset,
  viewportPadding,
  delay,
  closeDelay,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  dismissOnEscape,
  className,
  id,
  style,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { open: isOpen, triggerProps, tooltipProps } = useTooltip({
    anchorRef,
    side,
    align,
    sideOffset,
    viewportPadding,
    delay,
    closeDelay,
    open,
    defaultOpen,
    onOpenChange,
    dismissOnEscape,
    disabled,
  });

  // A custom `id` must back both the panel and the trigger's
  // `aria-describedby`, so the reference always resolves.
  const effectiveId = id ?? tooltipProps.id;

  // Inject the tooltip id onto the trigger while open, preserving any
  // description IDs the trigger already carries; hover/focus handlers live on
  // the wrapper so they cover the whole trigger surface. Cloning requires a
  // single element: anything else renders as-is with a dev-only warning, and
  // the trigger gains no aria-describedby wiring.
  const isValidTrigger = React.isValidElement(children);
  if (process.env.NODE_ENV !== "production" && !isValidTrigger) {
    console.warn(
      "Tooltip requires a single React element as its child; the tooltip will not be announced for this trigger.",
    );
  }
  const describedBy = isValidTrigger
    ? (children.props as Record<string, unknown>)["aria-describedby"]
    : undefined;
  const trigger = isValidTrigger
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        "aria-describedby": isOpen
          ? [typeof describedBy === "string" ? describedBy : undefined, effectiveId]
              .filter(Boolean)
              .join(" ")
          : describedBy,
      })
    : null;

  return (
    <Box
      as="span"
      className="inline-block"
      ref={anchorRef}
      onPointerEnter={disabled ? undefined : triggerProps.onPointerEnter}
      onPointerLeave={disabled ? undefined : triggerProps.onPointerLeave}
      onFocus={disabled ? undefined : triggerProps.onFocus}
      onBlur={disabled ? undefined : triggerProps.onBlur}
    >
      {disabled || !trigger ? children : trigger}
      {isOpen && !disabled && (
        <Portal>
          <Box
            ref={tooltipProps.ref}
            id={effectiveId}
            role="tooltip"
            style={{ ...tooltipProps.style, ...style }}
            className={cn(tooltipVariants, className)}
            onPointerEnter={tooltipProps.onPointerEnter}
            onPointerLeave={tooltipProps.onPointerLeave}
          >
            {label}
          </Box>
        </Portal>
      )}
    </Box>
  );
};
