import React from "react";
import { Box } from "../Box";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import type { BadgeProps } from "./badge.types";
import { badgeVariants, badgeGeometryVariants, badgePaletteRecipe } from "./badge.variants";
import { cr } from "../../lib/colorRecipes/colorRecipes";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      content,
      max,
      color = "default",
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

    const family = color === "default" ? "slate" : color;
    const cooked = cr(family, badgePaletteRecipe);

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
                position,
              }),
              cooked.className,
              getResponsiveClassNames(size, (value) =>
                badgeGeometryVariants({ size: value, variant: "dot" }),
              ),
              "motion-safe:animate-[ping_1.5s_ease-out_infinite]",
            )}
            style={{ ...cooked.style, ...style }}
          />
        )}
        <Box
          as="span"
          ref={ref}
          data-slot="badge"
          className={cn(
            badgeVariants({ variant, position }),
            cooked.className,
            getResponsiveClassNames(size, (value) =>
              badgeGeometryVariants({ size: value, variant }),
            ),
            className,
          )}
          style={{ ...cooked.style, ...style }}
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
