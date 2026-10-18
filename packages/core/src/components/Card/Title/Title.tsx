import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../../Box";
import { AllowedHeaderElements, CardTitleOwnProps } from "../card.types";
import {
  cardTitleVariants,
  cardTitleSizeClasses,
  cardTextAlignClasses,
  cardTextPaletteRecipe,
} from "../card.variants";
import { cr, isPaletteColor } from "../../../lib/colorRecipes/colorRecipes";
import { getTextFlowClasses } from "../../../lib";

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
    style,
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: CardTitleOwnProps & { as?: As },
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h3") as As;
  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });
  const palette = isPaletteColor(color);
  const cooked = palette ? cr(color, cardTextPaletteRecipe) : null;
  const resolvedStyles = cn(
    cardTitleVariants({
      size: null,
      weight: weight,
      color: palette ? "palette" : color,
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => cardTitleSizeClasses[value]),
    getResponsiveClassNames(align, (value) => cardTextAlignClasses[value]),
    flow.className,
    className,
    cooked?.className,
  );
  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);
  const normalizedRest = normalizeProps(rest);
  return (
    <Box
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      style={{ ...cooked?.style, ...style }}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const CardTitle = forwardRefWithAs<CardTitleOwnProps, AllowedHeaderElements>(_Title);
(CardTitle as unknown as { displayName?: string }).displayName = "CardTitle";
