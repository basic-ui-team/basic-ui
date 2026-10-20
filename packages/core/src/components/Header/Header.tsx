import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import { AllowedHeaderElements, HeaderOwnProps, HeaderProps } from "./header.types";
import { headerVariants, headerSizeClasses, headerAlignClasses, headerPaletteRecipe } from "./header.variants";
import { cr, isPaletteColor } from "../../lib/colorRecipes/colorRecipes";
import { Box, BoxProps } from "../Box";
import { getTextFlowClasses } from "../../lib";

const _Header = <As extends AllowedHeaderElements = "h1">(
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
  }: HeaderProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h1") as As;

  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });
  const palette = isPaletteColor(color);
  const cooked = palette ? cr(color, headerPaletteRecipe) : null;

  const resolvedStyles = cn(
    headerVariants({
      size: null,
      weight,
      color: palette ? "palette" : color,
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => headerSizeClasses[value]),
    getResponsiveClassNames(align, (value) => headerAlignClasses[value]),
    flow.className,
    className,
    cooked?.className,
  );

  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest);

  return (
    <Box<As>
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

export const Header = forwardRefWithAs<HeaderOwnProps, AllowedHeaderElements>(_Header);

(Header as unknown as { displayName?: string }).displayName = "Header";
