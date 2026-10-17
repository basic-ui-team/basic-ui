import { AllowedFlexElements, FlexProps, FlexOwnProps } from "./flex.types";
import { flexVariants } from "./flex.variants";
import {
  cn,
  forwardRefWithAs,
  getResponsiveClassNames,
  PolymorphicRef,
} from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../Box";

export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(
  <As extends AllowedFlexElements = "div">(
    {
      as,
      direction = "row",
      justify = "start",
      align = "stretch",
      wrap = "nowrap",
      display = "flex",
      className,
      style,
      children,
      ...rest
    }: FlexProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const Comp = (as || "div") as As;

    return (
      <Box
        as={Comp}
        ref={ref}
        className={cn(
          getResponsiveClassNames(direction, (value) => flexVariants({ direction: value })),
          getResponsiveClassNames(justify, (value) => flexVariants({ justify: value })),
          getResponsiveClassNames(align, (value) => flexVariants({ align: value })),
          getResponsiveClassNames(wrap, (value) => flexVariants({ wrap: value })),
          getResponsiveClassNames(display, (value) => flexVariants({ display: value })),
          className,
        )}
        style={style}
        {...(rest as BoxProps<As>)}
      >
        {children}
      </Box>
    );
  },
);

(Flex as { displayName?: string }).displayName = "Flex";
