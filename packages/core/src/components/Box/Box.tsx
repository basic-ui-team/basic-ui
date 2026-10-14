import { CommonProps, PolymorphicRef } from "@basic-ui/react-utilities";
import type { BoxProps } from "./box.types";
import { cn } from "@basic-ui/react-utilities";
import { forwardRefWithAs } from "@basic-ui/react-utilities";
import { generateLayoutClassNames, splitLayoutProps } from "../../lib/layout/layout-utils";
import { ElementType } from "react";
import { LayoutProps } from "@core/lib/layout";

export const Box = forwardRefWithAs<LayoutProps & CommonProps, ElementType>(
  <As extends ElementType = "div">(
    { as, className, children, style, ...restProps }: BoxProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const Comp: ElementType = as ?? "div";

    const { layout, rest } = splitLayoutProps(restProps);
    const { layoutClassNameString } = generateLayoutClassNames(layout);

    const resolvedStyles = cn(layoutClassNameString, className);

    return (
      <Comp ref={ref} className={resolvedStyles} style={style} {...rest}>
        {children}
      </Comp>
    );
  },
);

(Box as unknown as { displayName?: string }).displayName = "Box";

export default Box;
