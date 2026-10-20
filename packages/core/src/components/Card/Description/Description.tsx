import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../../Box";
import { AllowedTextElements, CardDescriptionOwnProps } from "../card.types";
import {
  cardDescriptionVariants,
  cardDescriptionSizeClasses,
  cardTextAlignClasses,
  cardTextPaletteRecipe,
} from "../card.variants";
import { getTextFlowClasses } from "../../../lib";
import { cr, isPaletteColor } from "../../../lib/colorRecipes/colorRecipes";
import { useContext } from "react";
import { CardContext } from "../Card";

const _Description = <As extends AllowedTextElements = "p">(
  {
    as,
    size = "md",
    weight = "normal",
    color,
    align = "left",
    truncate = false,
    wrap = "wrap",
    children,
    className,
    style,
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: CardDescriptionOwnProps & { as?: As },
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;
  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });
  const selected = useContext(CardContext)?.selected;
  const palette = isPaletteColor(color);
  const cooked = palette ? cr(color, cardTextPaletteRecipe) : null;

  const colorVariant = palette ? "palette" : color ?? (selected ? "inherit" : "default");

  const resolvedStyles = cn(
    cardDescriptionVariants({
      size: null,
      weight: weight,
      color: colorVariant,
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => cardDescriptionSizeClasses[value]),
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

export const CardDescription = forwardRefWithAs<CardDescriptionOwnProps, AllowedTextElements>(
  _Description,
);
(CardDescription as unknown as { displayName?: string }).displayName = "CardDescription";
