import { PolymorphicRef } from "@basic-ui/react-utilities";
import { AllowedFlexElements, FlexProps, FlexOwnProps } from "./flex.types";
import { useResponsiveProps } from "@basic-ui/react-utilities";
import { flexVariants } from "./flex.variants";
import { cn } from "@basic-ui/react-utilities";
import { forwardRefWithAs } from "@basic-ui/react-utilities"; // Removed normalizeProps
import { Box, BoxProps } from "../Box"; // Import Box

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
