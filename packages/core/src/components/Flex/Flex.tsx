import { PolymorphicRef } from "@core/types/props";
import { AllowedFlexElements, FlexProps, FlexOwnProps, spacingType } from "./flex.types";
import { useResponsiveProps } from "@core/hooks";
import { flexVariants } from "./flex.variants";
import { cn } from "@core/lib/cn/cn";
import { forwardRefWithAs, normalizeProps } from "@core/lib";


const _Flex = <As extends AllowedFlexElements = "div">(
  {
    as,
    direction,
    gap,
    padding,
    paddingX,
    paddingY,
    justify,
    align,
    wrap,
    inline,
    className,
    children,
    ...rest
  }: FlexProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const {
    direction: resolvedDirection,
    gap: resolvedGap,
    padding: resolvedPadding,
    paddingX: resolvedPaddingX,
    paddingY: resolvedPaddingY,
    justify: resolvedJustify,
    align: resolvedAlign,
    wrap: resolvedWrap,
    inline: resolvedInline,
  } = useResponsiveProps({
    direction,
    gap,
    padding,
    paddingX,
    paddingY,
    justify,
    align,
    wrap,
    inline,
  });



  const resolvedStyles = cn(
    flexVariants({
      direction: resolvedDirection,
      gap: resolvedGap as spacingType,
      padding: resolvedPadding as spacingType,
      paddingX: resolvedPaddingX as spacingType,
      paddingY: resolvedPaddingY as spacingType,
      justify: resolvedJustify,
      align: resolvedAlign,
      wrap: resolvedWrap,
      inline: resolvedInline,
    }),
    className,
  );

  const restAny = normalizeProps(rest as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Flex = forwardRefWithAs<FlexOwnProps, AllowedFlexElements>(_Flex);
(Flex as any).displayName = "Flex";
