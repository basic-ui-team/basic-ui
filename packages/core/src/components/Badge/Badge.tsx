import React from "react";
import { Box } from "@core/components/Box";
import { BadgeColor, BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";
import { useResponsiveProps } from "@core/hooks";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      content,
      max,
      color = "primary",
      variant = "standard",
      size = "medium",
      shape = "circular",
      visible = true,
      position = "top-right",
      ping = false,
      className,
      style,
      children,
      ariaLabel,
      ariaHidden = true,
      ariaLive,
      ...rest
    },
    ref,
  ) => {
    const displayContent =
      typeof content === "number" && max !== undefined && content > max ? `${max}+` : content;

    const {
      size: responsiveSize,
    } = useResponsiveProps({
      size,
    });

    return (
      <Box as="div" display="inline-block" position="relative">
        {children}
        <Box
          as="span"
          ref={ref}
          data-visible={visible}
          className={badgeVariants({
            variant,
            size: responsiveSize,
            shape,
            color: color as BadgeColor,
            position,
            ping,

            className,
          })}
          style={style}
          aria-label={ariaLabel}
          aria-hidden={ariaLabel ? undefined : ariaHidden}
          aria-live={ariaHidden ? undefined : ariaLive || "polite"}
          {...rest}
        >
          {variant === "dot" ? null : displayContent}
        </Box>
        {ping && (
          <Box
            as="span"
            className={badgeVariants({
              variant: "dot",
              size: responsiveSize,
              shape,
              color: color as BadgeColor,
              position,
              ping: false,
            })}
          />
        )}
      </Box>
    );
  },
);
