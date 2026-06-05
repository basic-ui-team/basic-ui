import React from "react";
import { Box } from "@core/components/Box";
import { BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";
import { useResponsiveProps } from "@core/hooks";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      content,
      max,
      color = "default",
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
      variant: responsiveVariant,
      size: responsiveSize,
      shape: responsiveShape,
      position: responsivePosition,
      ping: responsivePing,
    } = useResponsiveProps({
      variant,
      size,
      shape,
      position,
      ping,
    });

    return (
      <Box as="div" display="inline-block" position="relative">
        {children}
        <Box
          as="span"
          ref={ref}
          data-visible={visible}
          className={badgeVariants({
            variant: responsiveVariant,
            size: responsiveSize,
            shape: responsiveShape,
            color,
            position: responsivePosition,
            ping: responsivePing,
            className,
          })}
          style={style}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden && !ariaLabel ? true : undefined}
          aria-live={ariaLive}
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
              shape: responsiveShape,
              color,
              position: responsivePosition,
              ping: false,
            })}
          />
        )}
      </Box>
    );
  },
);
