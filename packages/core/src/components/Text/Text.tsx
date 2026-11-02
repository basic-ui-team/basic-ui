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
    style,
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: TextProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "p") as As;

  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });

  const resolvedStyles = cn(
    textVariants({
      size: null,
      weight,
      color,
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => textSizeClasses[value]),
    getResponsiveClassNames(Comp === "span" ? "left" : align, (value) => textAlignClasses[value]),
    flow.className,
    className,
  );

  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest as Record<string, unknown>);

  return (
    <Box<As>
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      style={style}
      {...accessibilityProps}
      {...(normalizedRest as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const Text = forwardRefWithAs<TextOwnProps, AllowedTextElements>(_Text);

(Text as unknown as { displayName?: string }).displayName = "Text";
