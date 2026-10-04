import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  useResponsiveProps,
} from "@basic-ui/react-utilities";
import { PolymorphicRef } from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../../Box";
import { AllowedHeaderElements, CardTitleOwnProps } from "../card.types";
import { cardTitleVariants } from "../card.variants";
import { BuiltInSemanticColors, isBuiltInSemanticColor } from "@core/theme";

const _Title = <As extends AllowedHeaderElements = "h3">(
  {
    as,
    size = "h2",
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "nowrap",
    children,
    className,
    ...rest
  }: CardTitleOwnProps & { as?: As },
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h3") as As;
  const { size: resolvedSize, weight: resolvedWeight, align: resolvedAlign, wrap: resolvedWrap, truncate: resolvedTruncate, color: resolvedColor } =
    useResponsiveProps({ size, weight, align, wrap, truncate, color });
  const isBuiltInColor = isBuiltInSemanticColor(resolvedColor);
  const resolvedStyles = cn(
    cardTitleVariants({
      size: resolvedSize,
      weight: resolvedWeight,
      color: isBuiltInColor ? (resolvedColor as BuiltInSemanticColors) : "custom",
      align: resolvedAlign,
      truncate: resolvedTruncate,
      wrap: resolvedWrap,
    }),
    className,
    !isBuiltInColor && resolvedColor ? resolvedColor : null,
  );
  const accessibilityProps =
    resolvedTruncate && getTruncateAccessibilityProps(children, resolvedTruncate, rest);
  const normalizedRest = normalizeProps(rest);
  return (
    <Box
      as={Comp}
      ref={ref}
      overflow={resolvedTruncate ? "hidden" : undefined}
      className={resolvedStyles}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const CardTitle = forwardRefWithAs<CardTitleOwnProps, AllowedHeaderElements>(_Title);
(CardTitle as unknown as { displayName?: string }).displayName = "CardTitle";
