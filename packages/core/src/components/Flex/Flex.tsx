import { PolymorphicRef } from "@core/types/props";
import {
  AllowedFlexElements,
  FlexProps,
  gapSize,
  gapValues,
  paddingSize,
  paddingValues,
} from "./flex.types";
import { useResponsive } from "@core/hooks";
import { flexVariants } from "./flex.variants";
import { cn } from "@core/lib/cn/cn";
import { normalizeProps } from "@core/lib";
import React from "react";

const _Flex = <As extends AllowedFlexElements = "div">(
  {
    as,
    direction,
    gap,
    padding,
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
  const resolvedJustify = useResponsive(justify);
  const resolvedAlign = useResponsive(align);
  const resolvedWrap = useResponsive(wrap);
  const resolvedInline = useResponsive(inline);

  const isCustomGap = resolvedGap !== undefined && !(resolvedGap in gapValues);
  const isCustomPadding = resolvedPadding !== undefined && !(resolvedPadding in paddingValues);

  const resolvedStyles = cn(
    flexVariants({
      direction: resolvedDirection,
      gap: isCustomGap ? "custom" : (resolvedGap as gapSize | undefined),
      padding: isCustomPadding ? "custom" : (resolvedPadding as paddingSize | undefined),
      justify: resolvedJustify,
      align: resolvedAlign,
      wrap: resolvedWrap,
      inline: resolvedInline,
    }),
    `${className} ${isCustomGap ? String(resolvedGap) : ""} ${
      isCustomPadding ? String(resolvedPadding) : "" // cast to string to ensure tailwind can parse it if it's a custom value
    }`,
  );

  const restAny = normalizeProps(rest as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Flex = React.forwardRef(_Flex) as <As extends AllowedFlexElements = "div">(
  props: FlexProps<As> & { ref?: PolymorphicRef<As> },
) => React.ReactElement;

(Flex as any).displayName = "Flex";
