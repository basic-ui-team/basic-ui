import { CommonProps, PolymorphicRef } from "@basic-ui/react-utilities";
import type { BoxProps } from "./box.types";
import { cn } from "@basic-ui/react-utilities";
import { forwardRefWithAs, normalizeProps } from "@basic-ui/react-utilities";
import { generateLayoutClassNames, splitLayoutProps } from "../../lib/layout/layout-utils";
import { ElementType } from "react";
import { LayoutProps } from "@core/lib/layout";

const _Box = <As extends ElementType = "div">(
  { as, className, children, style, ...restProps }: BoxProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const { layout, rest } = splitLayoutProps(restProps);
  const { layoutClassNameString } = generateLayoutClassNames(layout);

  const resolvedStyles = cn(layoutClassNameString, className);

  const normalizedProps = normalizeProps(rest as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} style={style} {...(normalizedProps as any)}>
      {children}
    </Comp>
  );
};

export const Box = forwardRefWithAs<LayoutProps & CommonProps, ElementType>(_Box as any);
(Box as unknown as { displayName?: string }).displayName = "Box";

export default Box;
