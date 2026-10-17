import { AllowedFlexElements, FlexProps, FlexOwnProps } from "./flex.types";
import { flexVariants, flexVariantsConfig } from "./flex.variants";
import {
  cn,
  forwardRefWithAs,
  getResponsiveClassNames,
  PolymorphicRef,
  ResponsiveValue,
} from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../Box";

const flexDefaults = {
  direction: "row",
  wrap: "nowrap",
  justify: "start",
  align: "stretch",
  display: "flex",
} as const;

type FlexStyleProps = Pick<FlexOwnProps, keyof typeof flexDefaults>;

function isResponsiveObject<Value>(value: ResponsiveValue<Value>): value is { base: Value } {
  return typeof value === "object" && value !== null && "base" in value;
}

function getBaseValue<Value>(value: ResponsiveValue<Value>): Value {
  return isResponsiveObject(value) ? value.base : value;
}

function resolveFlexDefaults({
  direction,
  justify,
  align,
  wrap,
  display,
}: FlexStyleProps): Required<FlexStyleProps> {
  return {
    direction: direction ?? flexDefaults.direction,
    justify: justify ?? flexDefaults.justify,
    align: align ?? flexDefaults.align,
    wrap: wrap ?? flexDefaults.wrap,
    display: display ?? flexDefaults.display,
  };
}

function getFlexClassNames(props: FlexStyleProps): string {
  const resolved = resolveFlexDefaults(props);

  return cn(
    flexVariants({
      direction: getBaseValue(resolved.direction),
      justify: getBaseValue(resolved.justify),
      align: getBaseValue(resolved.align),
      wrap: getBaseValue(resolved.wrap),
      display: getBaseValue(resolved.display),
    }),
    getResponsiveClassNames(
      resolved.direction,
      (value) => flexVariantsConfig.variants.direction[value],
    ),
    getResponsiveClassNames(
      resolved.justify,
      (value) => flexVariantsConfig.variants.justify[value],
    ),
    getResponsiveClassNames(resolved.align, (value) => flexVariantsConfig.variants.align[value]),
    getResponsiveClassNames(resolved.wrap, (value) => flexVariantsConfig.variants.wrap[value]),
    getResponsiveClassNames(
      resolved.display,
      (value) => flexVariantsConfig.variants.display[value],
    ),
  );
}

export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(
  <As extends AllowedFlexElements = "div">(
    {
      as,
      direction = "row",
      justify,
      align,
      wrap,
      display,
      className,
      style,
      children,
      ...rest
    }: FlexProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const Comp = (as || "div") as As;

    const flexClasses = getFlexClassNames({
      direction,
      justify,
      align,
      wrap,
      display,
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
  },
);

(Flex as { displayName?: string }).displayName = "Flex";
