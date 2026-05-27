import { PolymorphicRef } from "@core/types/props";
import { AllowedFlexElements, FlexProps, FlexOwnProps } from "./flex.types";
import { useResponsiveProps } from "@core/hooks";
import { flexVariants } from "./flex.variants";
import { cn } from "@core/lib/cn/cn";
import { forwardRefWithAs, normalizeProps } from "@core/lib";
import { generateLayoutClassNames, splitLayoutProps } from "../Layout/layout";

const _Flex = <As extends AllowedFlexElements = "div">(
  {
    as,
    direction = "row",
    justify,
    align,
    wrap,
    gap,
    inline,
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
    inline: resolvedInline,
  } = useResponsiveProps({
    direction,
    justify,
    align,
    wrap,
    gap,
    inline,
  });

  const { layout: layoutProps, rest: restProps } = splitLayoutProps(
    rest as Record<string, unknown>,
  );

  const resolvedLayoutProps = generateLayoutClassNames(layoutProps);

  const resolvedStyles = cn(
    resolvedLayoutProps,
    flexVariants({
      direction: resolvedDirection,
      justify: resolvedJustify,
      align: resolvedAlign,
      wrap: resolvedWrap,
      gap: resolvedGap,
      inline: resolvedInline, // TODO: This is a bit awkward. Maybe we should have a separate "display" prop that can be set to "flex" or "inline-flex" instead of having an "inline" boolean?
    }),
    className,
  );
  const restAny = normalizeProps(restProps as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(_Flex);
(Flex as any).displayName = "Flex";
