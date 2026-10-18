import React from "react";
import type { IconProps } from "./icon.types";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import { iconSizeClasses, iconVariants } from "./icon.variants";
import { Box } from "../Box";

/**
 * Icon — Pure presentational icon component
 *
 * Wraps any SVG icon with consistent styling, sizing, and accessibility.
 * Pass icon components from @basic-ui/icons or custom SVG elements.
 *
 * Defaults to `aria-hidden="true"` since icons are typically decorative;
 * pass `aria-hidden={false}` and an `aria-label` when the icon conveys meaning.
 * Supports responsive sizing via ResponsiveValue.
 * Inherits the surrounding color unless a semantic color is explicitly provided.
 *
 * @example
 * // From @basic-ui/icons
 * import { CheckCircle } from "@basic-ui/icons";
 * <Icon icon={CheckCircle} color="success" />
 *
 * // Custom SVG
 * <Icon icon={<svg>...</svg>} size="lg" color="primary" />
 *
 * // Responsive: md=md, lg=lg
 * <Icon icon={CheckCircle} size={{ base: "sm", md: "md", lg: "lg" }} />
 *
 * // Layout props apply to the existing wrapper; no outer Box is needed
 * <Icon icon={CheckCircle} p={2} />
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      icon,
      size = "md",
      color,
      className,
      "aria-hidden": ariaHidden = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <Box
        as="span"
        ref={ref}
        className={cn(
          iconVariants({ color, size: null }),
          getResponsiveClassNames(size, (value) => iconSizeClasses[value]),
          className,
        )}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? "img" : undefined}
        {...props}
      >
        {icon}
      </Box>
    );
  },
);

Icon.displayName = "Icon";
