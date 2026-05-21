import { PolymorphicRef } from "@core/types/props";
import { AllowedFlexElements, FlexProps, FlexOwnProps, spacingType } from "./flex.types";
import { useResponsiveProps } from "@core/hooks";
import { flexVariants } from "./flex.variants";
import { cn } from "@core/lib/cn/cn";
import { forwardRefWithAs, normalizeProps } from "@core/lib";
import { tokenResolver } from "@basic-ui/tokens";

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

  const isCustomGap = resolvedGap !== undefined && !tokenResolver.isToken("spacing", resolvedGap);
  const paddings = [resolvedPadding, resolvedPaddingX, resolvedPaddingY].filter(Boolean) as (
    | spacingType
    | string
  )[];
  const isCustomPadding = paddings.some(
    (p) => p !== undefined && !tokenResolver.isToken("spacing", p),
  );

  const resolvedStyles = cn(
    flexVariants({
      direction: resolvedDirection,
      gap: isCustomGap ? "custom" : (resolvedGap as spacingType | undefined),
      padding: isCustomPadding ? "custom" : (resolvedPadding as spacingType | undefined),
      paddingX: isCustomPadding ? "custom" : (resolvedPaddingX as spacingType | undefined),
      paddingY: isCustomPadding ? "custom" : (resolvedPaddingY as spacingType | undefined),
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
