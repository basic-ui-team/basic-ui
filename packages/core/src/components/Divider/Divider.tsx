import { PolymorphicRef } from "@core/types/props";
import { AllowedDividerElements, DividerProps, DividerOwnProps } from "./divider.props";
import { useResponsiveProps } from "@core/hooks";
import { Box, BoxProps } from "../Box";
import { cn, forwardRefWithAs } from "@core/lib";
import { dividerVariants } from "./divider.variants";

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
    color = "base",
    inset = "none",
    label,
    m = "none",
    p = "none",
    className,
    style,
    ...rest
  }: DividerProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || (label ? "div" : "hr")) as AllowedDividerElements;

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

  const {
    direction: resolvedDirection,
    thickness: resolvedThickness,
    appearance: resolvedAppearance,
    color: resolvedColor,
    inset: resolvedInset,
  } = useResponsiveProps({ direction, thickness, appearance, color, inset });

  return (
    <Box
      as={Comp}
      m={m}
      p={p}
      px={resolvedDirection === "horizontal" ? resolvedInset : undefined}
      py={resolvedDirection === "vertical" ? resolvedInset : undefined}
      ref={ref}
      role={isDecorative ? "presentation" : "separator"}
      aria-label={isSemantic && label ? label : undefined}
      aria-orientation={isDecorative ? undefined : (resolvedDirection as "horizontal" | "vertical")}
      className={cn(
        dividerVariants({
          direction: resolvedDirection,
          appearance: resolvedAppearance,
          color: resolvedColor,
          thickness: resolvedThickness,
        }),
        className,
      )}
      style={style}
      {...(rest as BoxProps<As>)}
    >
      {/* NOTE: Replace this with proper label component when available */}
      {label && (
        <span className="flex-shrink-0 bg-background px-2 text-muted-foreground text-sm">
          {label}
        </span>
      )}
    </Box>
  );
};

export const Divider = forwardRefWithAs<DividerOwnProps, AllowedDividerElements>(_Divider);

(Divider as unknown as { displayName?: string }).displayName = "Divider";
