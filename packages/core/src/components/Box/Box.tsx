import { CommonProps, PolymorphicRef, cn, forwardRefWithAs } from "@basic-ui/react-utilities";
import type { BoxProps } from "./box.types";
import { ElementType } from "react";
import { LayoutProps, splitLayoutProps, generateLayoutClassNames } from "@core/lib";

export const Box = forwardRefWithAs<LayoutProps & CommonProps, ElementType>(
  <As extends ElementType = "div">(
    { as, className, children, style, ...restProps }: BoxProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const Comp: ElementType = as ?? "div";

    const { layout, rest } = splitLayoutProps(restProps);
    const { layoutClassNameString } = generateLayoutClassNames(layout);

    return (
      <Comp ref={ref} className={cn(layoutClassNameString, className)} style={style} {...rest}>
        {children}
      </Comp>
    );
  },
);

(Box as unknown as { displayName?: string }).displayName = "Box";

export default Box;
