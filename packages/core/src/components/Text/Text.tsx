import React from "react";
import { cn } from "@core/lib";
import type { AllowedTextElements, TextProps, builtInColorUnion } from "./text.types";
import { textVariants } from "./text.variants";
import { PolymorphicRef } from "@core/types/props";
import { useResponsive } from "@core/hooks";

const _Text = <As extends AllowedTextElements = "p">(
  {
    as,
    size = "md",
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "nowrap",
    children,
    className,
    ...rest
  }: TextProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;

  const resolvedSize = useResponsive(size);
  const resolvedWeight = useResponsive(weight);
  const resolvedAlign = useResponsive(align);
  const resolvedTruncate = useResponsive(truncate);
  const resolvedWrap = useResponsive(wrap);
  const resolvedColor = useResponsive(color) as builtInColorUnion | string;

  const isBuiltInColor = (
    [
      "default",
      "muted",
      "primary",
      "secondary",
      "error",
      "success",
      "warning",
      "info",
    ] as builtInColorUnion[]
  ).includes(resolvedColor as builtInColorUnion);

  const resolvedStyles = cn(
    textVariants({
      size: resolvedSize,
      weight: resolvedWeight,
      color: isBuiltInColor ? (resolvedColor as builtInColorUnion) : "custom",
      // Only apply align styles to block-level elements since text-align doesn't apply to inline elements
      align: Comp === "span" ? undefined : resolvedAlign,
      truncate: resolvedTruncate,
      wrap: resolvedWrap,
    }),
    className,
    // If it's a custom color (not in the built-in set), allow passing in arbitrary class names for color (e.g. Tailwind classes like "text-red-500" or custom CSS variables like "text-[var(--my-color)]")
    !isBuiltInColor && resolvedColor ? resolvedColor : "",
  );

  // Accessibility: if text is visually truncated and the consumer didn't provide
  // a `title` or `aria-label`, expose the full text to assistive tech via both
  // `title` (hover) and `aria-label` (screen readers) when `children` is a string.
  const accessibilityProps: Record<string, unknown> = {};
  const restAny = rest as Record<string, unknown>;
  const hasTitle = restAny.title !== undefined;
  const hasAriaLabel = restAny["aria-label"] !== undefined || restAny.ariaLabel !== undefined;

  if (resolvedTruncate && !hasTitle && !hasAriaLabel && typeof children === "string") {
    accessibilityProps.title = children;
    accessibilityProps["aria-label"] = children;
  }

  return (
    //@ts-expect-error Polymorphic component with dynamic element type can be tricky to type perfectly, but the core props should work correctly
    // The type safety is enforced by the function signature (PolymorphicRef<As>)
    // and the fact that 'as' determines the actual DOM element. We'll test it to ensure it behaves as expected.
    <Comp ref={ref} className={resolvedStyles} {...accessibilityProps} {...rest}>
      {children}
    </Comp>
  );
};

export const Text = React.forwardRef(_Text) as <Element extends AllowedTextElements = "p">(
  props: TextProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement | null;

(Text as any).displayName = "Text";
