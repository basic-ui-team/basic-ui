import { PolymorphicRef } from "@core/types/props";
import type { AllowedBoxElements, BoxProps } from "./box.types";
import { useResponsiveProps } from "@core/hooks";
import { cn } from "@core/lib/cn/cn";
import { forwardRefWithAs, normalizeProps } from "@core/lib";
import { generateLayoutClassNames } from "../Layout/layout";
import { boxVariants } from "./box.variants";

const _Box = <As extends AllowedBoxElements = "div">(
  { as, display, className, children, style, layout, ...rest }: BoxProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const { display: resolvedDisplay } = useResponsiveProps({
    display,
  });

  const resolvedLayoutProps = generateLayoutClassNames(layout);

  const resolvedStyles = cn(
    resolvedLayoutProps,
    boxVariants({
      display: resolvedDisplay, // TODO: We should probably have a separate "display" prop in the layout variants instead of trying to shoehorn it in here, since it's not really a "layout" prop per se. But for now this will do.
    }),
    className,
  );

  const restAny = normalizeProps(rest as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} style={style} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Box = forwardRefWithAs<BoxProps, AllowedBoxElements>(_Box as any);
(Box as any).displayName = "Box";

export default Box;
