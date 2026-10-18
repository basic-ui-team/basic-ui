import { cn, forwardRefWithAs, PolymorphicRef, getResponsiveClassNames } from "@basic-ui/react-utilities";
import { AllowedDividerElements, DividerProps, DividerOwnProps } from "./divider.types";
import { Box, BoxProps } from "../Box";
import { dividerVariants, dividerThicknessClasses, dividerPaletteRecipe } from "./divider.variants";
import { cr, isPaletteColor } from "../../lib/colorRecipes/colorRecipes";

/**
 * Divider
 *
 * A flexible and accessible divider component that can be used to separate content in a variety of ways.
 * Supports both horizontal and vertical orientations, multiple appearances (solid, dashed, dotted), thickness options, and color variants.
 * Can be used as a decorative element or as a semantic separator with appropriate ARIA roles.
 */
const _Divider = <As extends AllowedDividerElements = "hr">(
  {
    as,
    direction = "horizontal",
    decorative = true,
    appearance = "solid",
    thickness = "medium",
    color = "default",
    inset = 0,
    label,
    m = 0,
    p = 0,
    className,
    style,
    ...rest
  }: DividerProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || (label ? "div" : "hr")) as AllowedDividerElements;
  const palette = isPaletteColor(color);
  const cooked = palette ? cr(color, dividerPaletteRecipe) : null;

  // Treat the divider as semantic when the consumer explicitly sets `decorative={false}`
  // or provides a `label`. A labeled divider should be exposed to assistive tech.
  const isSemantic = decorative === false || Boolean(label);
  const isDecorative = !isSemantic;

  // If semantic and not using an HR element, warn the developer about semantic correctness.
  if (isSemantic && Comp !== "hr") {
    console.warn(
      `Divider: For semantic dividers (decorative={false} or label provided), it's recommended to use "hr" as the element for semantic correctness. You used "${Comp}". Consider changing to "hr" or setting decorative={true}.`,
    );
  }

  return (
    <Box
      as={Comp}
      m={m}
      p={p}
      mx={direction === "horizontal" ? inset : undefined}
      my={direction === "vertical" ? inset : undefined}
      ref={ref}
      role={isDecorative ? "presentation" : "separator"}
      aria-label={isSemantic && label ? label : undefined}
      aria-orientation={isDecorative ? undefined : direction}
      className={cn(
        dividerVariants({
          direction,
          appearance,
          color: palette ? "palette" : color,
        }),
        cooked && "border-(--cr-border)",
        getResponsiveClassNames(thickness, (value) => dividerThicknessClasses[direction][value]),
        className,
      )}
      style={{ ...cooked?.style, ...style }}
      {...(rest as BoxProps<As>)}
    >
      {/* NOTE: Replace this with proper label component when available */}
      {label && (
        <span className="shrink-0 bg-background px-2 text-muted-foreground text-sm">
          {label}
        </span>
      )}
    </Box>
  );
};

export const Divider = forwardRefWithAs<DividerOwnProps, AllowedDividerElements>(_Divider);

(Divider as unknown as { displayName?: string }).displayName = "Divider";
