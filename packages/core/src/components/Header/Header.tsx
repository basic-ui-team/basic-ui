import { useResponsive } from "@core/hooks";
import { AllowedHeaderElements, HeaderOwnProps, HeaderProps } from "./header.types";
import { headerVariants } from "./header.variants";
import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  isBuiltInHeaderColor,
  normalizeProps,
} from "@core/lib";
import { PolymorphicRef } from "@core/types/props";

const _Header = <As extends AllowedHeaderElements = "h1">(
  {
    as,
    size = "h2",
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "nowrap",
    children,
    className,
    ...rest
  }: HeaderProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h1") as As;

  const resolvedSize = useResponsive(size);
  const resolvedWeight = useResponsive(weight);
  const resolvedAlign = useResponsive(align);
  const resolvedTruncate = useResponsive(truncate);
  const resolvedWrap = useResponsive(wrap);
  const resolvedColor = useResponsive(color);

  const isBuiltInColor = isBuiltInHeaderColor(resolvedColor);

  const resolvedStyles = cn(
    headerVariants({
      size: resolvedSize,
      weight: resolvedWeight,
      color: isBuiltInColor ? resolvedColor : "custom",
      // Only apply align styles to block-level elements since text-align doesn't apply to inline elements
      align: resolvedAlign,
      truncate: resolvedTruncate,
      wrap: resolvedWrap,
    }),
    `${className} ${!isBuiltInColor && resolvedColor ? resolvedColor : ""}`,
  );

  // Accessibility: if header is visually truncated and the consumer didn't provide
  // a `title` or `aria-label`, expose the full text to assistive tech via both
  // `title` (hover) and `aria-label` (screen readers) when `children` is a string.
  const accessibilityProps = getTruncateAccessibilityProps(children, resolvedTruncate, rest);

  // Normalize props (non-mutating)
  const restAny = normalizeProps(rest as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} {...accessibilityProps} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Header = forwardRefWithAs<HeaderOwnProps, AllowedHeaderElements>(_Header);

(Header as any).displayName = "Header";
