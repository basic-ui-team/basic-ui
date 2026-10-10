import React, { useRef } from "react";
import { cn, Portal, useResponsiveProps, useTooltip } from "@basic-ui/react-utilities";
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
 * - Sizes (`sm`/`md`/`lg`, responsive) and semantic colours via CVA on
 *   basic-ui tokens
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
  delay,
  closeDelay,
  disabled = false,
  color = "inverted",
  bordered = false,
  size,
  dismissOnEscape,
  className,
  id,
  style,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { size: resolvedSize } = useResponsiveProps({ size: size ?? "md" });
  const { open, triggerProps, tooltipProps } = useTooltip({
    anchorRef,
    side,
    align,
    delay,
    closeDelay,
    dismissOnEscape,
    disabled,
  });

  // A custom `id` must back both the panel and the trigger's
  // `aria-describedby`, so the reference always resolves.
  const effectiveId = id ?? tooltipProps.id;

  // Inject the tooltip id onto the trigger while open, preserving any
  // description IDs the trigger already carries; hover/focus handlers live on
  // the wrapper so they cover the whole trigger surface.
  const childProps = (children as React.ReactElement<Record<string, unknown>>).props;
  const describedBy = childProps["aria-describedby"];
  const trigger = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    "aria-describedby": open
      ? [typeof describedBy === "string" ? describedBy : undefined, effectiveId]
          .filter(Boolean)
          .join(" ")
      : describedBy,
  });

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
      {disabled ? children : trigger}
      {open && !disabled && (
        <Portal>
          <Box
            ref={tooltipProps.ref}
            id={effectiveId}
            role="tooltip"
            style={{ ...tooltipProps.style, ...style }}
            className={cn(tooltipVariants({ color, size: resolvedSize, bordered }), className)}
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
