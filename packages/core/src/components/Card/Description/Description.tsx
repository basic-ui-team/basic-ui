import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  useResponsiveProps,
} from "@basic-ui/react-utilities";
import { PolymorphicRef } from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../../Box";
import { AllowedTextElements, CardDescriptionOwnProps } from "../card.types";
import { cardDescriptionVariants } from "../card.variants";
import { BuiltInSemanticColors, isBuiltInSemanticColor } from "@core/theme";

const _Description = <As extends AllowedTextElements = "p">(
  {
    as,
    size = "md",
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "wrap",
    children,
    className,
    ...rest
  }: CardDescriptionOwnProps & { as?: As },
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;
  const { size: resolvedSize, weight: resolvedWeight, align: resolvedAlign, wrap: resolvedWrap, truncate: resolvedTruncate, color: resolvedColor } =
    useResponsiveProps({ size, weight, align, wrap, truncate, color });
  const isBuiltInColor = isBuiltInSemanticColor(resolvedColor);
  const resolvedStyles = cn(
    cardDescriptionVariants({
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
      className={resolvedStyles}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const CardDescription = forwardRefWithAs<CardDescriptionOwnProps, AllowedTextElements>(_Description);
(CardDescription as unknown as { displayName?: string }).displayName = "CardDescription";
