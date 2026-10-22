import { CommonProps, PolymorphicRef, forwardRefWithAs } from "@basic-ui/react-utilities";
import type { BoxProps } from "./box.types";
import { ElementType } from "react";

/**
 * Box — the polymorphic primitive.
 *
 * A thin styling shell: renders any element (`as`), merges `className` with
 * the library's class order, and forwards everything else. Tailwind is the
 * styling layer — author utilities directly in `className`; the library's
 * components carry the design opinions.
 */
export const Box = forwardRefWithAs<CommonProps, ElementType>(
  <As extends ElementType = "div">(
    { as, className, children, style, ...restProps }: BoxProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const Comp: ElementType = as ?? "div";

    return (
      <Comp ref={ref} className={className} style={style} {...restProps}>
        {children}
      </Comp>
    );
  },
);

(Box as unknown as { displayName?: string }).displayName = "Box";

export default Box;
