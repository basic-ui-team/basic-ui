import { PolymorphicRef } from "@core/types/props";
import { AllowedFlexElements, FlexProps, gapSize, paddingSize, paddingOptions, FlexOwnProps } from "./flex.types";
import { useResponsive } from "@core/hooks";
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

  const resolvedDirection = useResponsive(direction);
  const resolvedGap = useResponsive(gap);
  const resolvedPadding = useResponsive(padding);
  const resolvedPaddingX = useResponsive(paddingX);
  const resolvedPaddingY = useResponsive(paddingY);
  const resolvedJustify = useResponsive(justify);
  const resolvedAlign = useResponsive(align);
  const resolvedWrap = useResponsive(wrap);
  const resolvedInline = useResponsive(inline);

  const isCustomGap = resolvedGap !== undefined && !paddingOptions.includes(resolvedGap as any);
  const paddings = [resolvedPadding, resolvedPaddingX, resolvedPaddingY].filter(Boolean) as (
    | paddingSize
    | string
  )[];
  const isCustomPadding = paddings.some((p) => p !== undefined && !paddingOptions.includes(p as any));

  const resolvedStyles = cn(
    flexVariants({
      direction: resolvedDirection,
      gap: isCustomGap ? "custom" : (resolvedGap as gapSize | undefined),
      padding: isCustomPadding ? "custom" : (resolvedPadding as paddingSize | undefined),
      paddingX: isCustomPadding ? "custom" : (resolvedPaddingX as paddingSize | undefined),
      paddingY: isCustomPadding ? "custom" : (resolvedPaddingY as paddingSize | undefined),
      justify: resolvedJustify,
      align: resolvedAlign,
      wrap: resolvedWrap,
      inline: resolvedInline,
    }),
    className,
    // pass custom gap/padding as separate args so `clsx`/`twMerge` can ignore falsy values
    isCustomGap ? (String(resolvedGap) as unknown as string) : undefined,
    isCustomPadding ? paddings.map(String) : undefined,
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
