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
} from "../card.variants";
import { getCardTextFlowClasses } from "../card-text-utils";
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
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: CardDescriptionOwnProps & { as?: As },
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;
  const flow = getCardTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });
  const isBuiltInColor = isBuiltInSemanticColor(color);
  const resolvedStyles = cn(
    cardDescriptionVariants({
      size: null,
      weight: weight,
      color: isBuiltInColor ? (color as BuiltInSemanticColors) : "custom",
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => cardDescriptionSizeClasses[value]),
    getResponsiveClassNames(align, (value) => cardTextAlignClasses[value]),
    flow.className,
    className,
    !isBuiltInColor && color ? color : null,
  );
  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);
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

export const CardDescription = forwardRefWithAs<CardDescriptionOwnProps, AllowedTextElements>(
  _Description,
);
(CardDescription as unknown as { displayName?: string }).displayName = "CardDescription";
