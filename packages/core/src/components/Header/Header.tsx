import {
  cn,
  forwardRefWithAs,
  getTruncateAccessibilityProps,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import { AllowedHeaderElements, HeaderOwnProps, HeaderProps } from "./header.types";
import { headerVariants, headerSizeClasses, headerAlignClasses } from "./header.variants";
import { Box, BoxProps } from "../Box";
import { getTextFlowClasses } from "../../lib";

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
    style,
    overflow,
    overflowX,
    overflowY,
    ...rest
  }: HeaderProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "h1") as As;

  const flow = getTextFlowClasses({ truncate, wrap, overflow, overflowX, overflowY });

  const resolvedStyles = cn(
    headerVariants({
      size: null,
      weight,
      color,
      align: null,
      truncate: null,
      wrap: null,
    }),
    getResponsiveClassNames(size, (value) => headerSizeClasses[value]),
    getResponsiveClassNames(align, (value) => headerAlignClasses[value]),
    flow.className,
    className,
  );

  const accessibilityProps = getTruncateAccessibilityProps(children, flow.hasTruncation, rest);

  // Normalize props (non-mutating)
  const normalizedRest = normalizeProps(rest);

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

export const Header = forwardRefWithAs<HeaderOwnProps, AllowedHeaderElements>(_Header);

(Header as unknown as { displayName?: string }).displayName = "Header";
