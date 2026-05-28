import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  isBuiltInTextColor,
  normalizeProps,
} from "@core/lib";
import type { AllowedTextElements, TextOwnProps, TextProps, builtInColorUnion } from "./text.types";
import { textVariants } from "./text.variants";
import { PolymorphicRef } from "@core/types/props";
import { useResponsiveProps } from "@core/hooks";
import { Box } from "../Box";

const _Text = <As extends AllowedTextElements = "p">(
  {
    as,
    size = "md",
    weight = "normal",
    color = "default",
    align = "left",
    truncate = false,
    wrap = "wrap",
    children,
    className,
    ...rest
  }: TextProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;

  const {
    size: resolvedSize,
    weight: resolvedWeight,
    align: resolvedAlign,
    truncate: resolvedTruncate,
    wrap: resolvedWrap,
    color: resolvedColorRaw,
  } = useResponsiveProps({ size, weight, align, truncate, wrap, color });

  const resolvedColor = resolvedColorRaw as builtInColorUnion | string;

  const isBuiltInColor = isBuiltInTextColor(resolvedColor);

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
  const accessibilityProps =
    resolvedTruncate && getTruncateAccessibilityProps(children, resolvedTruncate, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest as Record<string, unknown>);

  return (
    <Box<As>
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      {...accessibilityProps}
      {...(normalizedRest as any)}
    >
      {children}
    </Box>
  );
};

export const Text = forwardRefWithAs<TextOwnProps, AllowedTextElements>(_Text);

(Text as any).displayName = "Text";
