import React from "react";
import { Box } from "../Box";
import { cn } from "@basic-ui/react-utilities";
import type { BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      content,
      max,
      color,
      variant = "count",
      size = "md",
      position = "top-right",
      ping = false,
      className,
      style,
      children,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
      "aria-live": ariaLive,
      ...rest
    },
    ref,
  ) => {
    const displayContent =
      typeof content === "number" && max !== undefined && content > max ? `${max}+` : content;
    const isDecorative = ariaHidden ?? (!ariaLabel && !ariaLive);

    if (process.env.NODE_ENV !== "production" && !isDecorative && !ariaLabel) {
      console.warn("An exposed Badge requires an aria-label.");
    }

    return (
      <Box as="span" className="relative inline-block" data-slot="badge-anchor">
        {children}
        {ping && (
          <Box
            as="span"
            aria-hidden="true"
            data-slot="badge-ping"
            className={cn(
              badgeVariants({
                variant: "dot",
                size,
                color,
                position,
              }),
              "motion-safe:animate-[ping_1.5s_ease-out_infinite]",
            )}
          />
        )}
        <Box
          as="span"
          ref={ref}
          data-slot="badge"
          className={cn(badgeVariants({ variant, size, color, position }), className)}
          style={style}
          aria-label={isDecorative ? undefined : ariaLabel}
          aria-hidden={isDecorative || undefined}
          aria-live={isDecorative ? undefined : ariaLive}
          {...rest}
        >
          {variant === "dot" ? null : displayContent}
        </Box>
      </Box>
    );
  },
);

Badge.displayName = "Badge";
