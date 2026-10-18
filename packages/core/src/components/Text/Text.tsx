import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import type { AllowedTextElements, TextOwnProps, TextProps } from "./text.types";
import { textVariants, textSizeClasses, textAlignClasses } from "./text.variants";
import { Box, BoxProps } from "../Box";
import { BuiltInSemanticColors, isBuiltInSemanticColor } from "../../theme";
import { getTextFlowClasses } from "../../lib";

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
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: TextProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;

  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });
  const isBuiltInColor = isBuiltInSemanticColor(color);

  const resolvedStyles = cn(
    textVariants({
      size: null,
      weight,
      color: isBuiltInColor ? (color as BuiltInSemanticColors) : "custom",
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => textSizeClasses[value]),
    getResponsiveClassNames(Comp === "span" ? "left" : align, (value) => textAlignClasses[value]),
    flow.className,
    className,
    // If it's a custom color (not in the built-in set), allow passing in arbitrary class names for color (e.g. Tailwind classes like "text-red-500" or custom CSS variables like "text-[var(--my-color)]")
    !isBuiltInColor && color ? color : "",
  );

  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest as Record<string, unknown>);

  return (
    <Box<As>
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const Text = forwardRefWithAs<TextOwnProps, AllowedTextElements>(_Text);

(Text as unknown as { displayName?: string }).displayName = "Text";
