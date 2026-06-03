import { useResponsiveProps } from "@core/hooks";
import { AllowedHeaderElements, HeaderOwnProps, HeaderProps } from "./header.types";
import { headerVariants } from "./header.variants";
import { cn, forwardRefWithAs, getTruncateAccessibilityProps, normalizeProps } from "@core/lib";
import { PolymorphicRef } from "@core/types/props";
import { Box, BoxProps } from "../Box";
import { BuiltInSemanticColors, isBuiltInSemanticColor } from "@core/theme";

const _Header = <As extends AllowedHeaderElements = "h1">(
  {
    as,
    size,
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "nowrap",
    children,
    className,
    ...rest
  }: HeaderProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h1") as As;

  const {
    size: resolvedSize,
    weight: resolvedWeight,
    align: resolvedAlign,
    wrap: resolvedWrap,
    truncate: resolvedTruncate,
    color: resolvedColor,
  } = useResponsiveProps({ size, weight, align, truncate, wrap, color });

  const isBuiltInColor = isBuiltInSemanticColor(resolvedColor);

  const resolvedStyles = cn(
    headerVariants({
      size: resolvedSize,
      weight: resolvedWeight,
      color: isBuiltInColor ? (resolvedColor as BuiltInSemanticColors) : "custom",
      // Only apply align styles to block-level elements since text-align doesn't apply to inline elements
      align: resolvedAlign,
      truncate: resolvedTruncate,
      wrap: resolvedWrap,
    }),
    className,
    !isBuiltInColor && resolvedColor ? resolvedColor : null, // If it's a custom color (not one of the built-in options), apply it directly as a className (which should be a valid CSS color value)
  );

  // Accessibility: if header is visually truncated and the consumer didn't provide
  // a `title` or `aria-label`, expose the full text to assistive tech via both
  // `title` (hover) and `aria-label` (screen readers) when `children` is a string.
  const accessibilityProps =
    resolvedTruncate && getTruncateAccessibilityProps(children, resolvedTruncate, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest);

  return (
    <Box<As>
      as={Comp}
      ref={ref}
      overflow={resolvedTruncate ? "hidden" : undefined} // Ensure overflow hidden is applied when truncation is enabled
      className={resolvedStyles}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const Header = forwardRefWithAs<HeaderOwnProps, AllowedHeaderElements>(_Header);

(Header as unknown as { displayName?: string }).displayName = "Header";
