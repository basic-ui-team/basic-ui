import React from "react";
import type { IconProps } from "./icon.types";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";
import { iconVariants } from "./icon.variants";
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
 *
 * @example
 * // From @basic-ui/icons
 * import { CheckCircle } from "@basic-ui/icons";
 * <Icon icon={CheckCircle} variant="success" />
 *
 * // Custom SVG
 * <Icon icon={<svg>...</svg>} size="lg" variant="primary" />
 *
 * // Responsive: md=md, lg=lg
 * <Icon icon={CheckCircle} size={{ base: "sm", md: "md", lg: "lg" }} />
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      icon,
      size = "md",
      variant = "default",
      color = "default",
      className,
      "aria-hidden": ariaHidden = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { size: resolvedSize } = useResponsiveProps({ size });

    return (
      <Box
        as="span"
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          iconVariants({ size: resolvedSize, variant, color }),
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
