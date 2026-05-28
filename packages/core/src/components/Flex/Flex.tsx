import { PolymorphicRef } from "@core/types/props";
import { AllowedFlexElements, FlexProps, FlexOwnProps } from "./flex.types";
import { useResponsiveProps } from "@core/hooks";
import { flexVariants } from "./flex.variants";
import { cn } from "@core/lib/cn/cn";
import { forwardRefWithAs } from "@core/lib"; // Removed normalizeProps
import { Box, BoxProps } from "@core/components"; // Import Box

const _Flex = <As extends AllowedFlexElements = "div">(
  {
    as,
    direction = "row",
    justify,
    align,
    wrap,
    gap,
    display,
    className,
    style,
    children,
    ...rest
  }: FlexProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const {
    direction: resolvedDirection,
    justify: resolvedJustify,
    align: resolvedAlign,
    wrap: resolvedWrap,
    gap: resolvedGap,
    display: resolvedDisplay,
  } = useResponsiveProps({
    direction,
    justify,
    align,
    wrap,
    gap,
    display,
  });

  const flexClasses = flexVariants({
    direction: resolvedDirection,
    justify: resolvedJustify,
    align: resolvedAlign,
    wrap: resolvedWrap,
    gap: resolvedGap,
    display: resolvedDisplay,
  });

  return (
    <Box
      as={Comp}
      ref={ref}
      className={cn(flexClasses, className)}
      style={style}
      {...(rest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(_Flex);
(Flex as unknown as { displayName?: string }).displayName = "Flex";
