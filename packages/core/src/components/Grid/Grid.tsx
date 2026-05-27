import { PolymorphicRef } from "@core/types/props";
import {
  type GridProps,
  type AllowedGridElements,
  type GridOwnProps,
  ColRowNumber,
} from "./grid.types";
import type { SpacingType } from "@core/components/Layout/layout.types";
import { useResponsiveProps } from "@core/hooks";
import { gridVariants } from "./grid.variants";
import { cn, forwardRefWithAs, normalizeProps } from "@core/lib";
import { generateLayoutClassNames, splitLayoutProps } from "../Layout/layout";

const _Grid = <As extends AllowedGridElements = "div">(
  {
    as,
    cols,
    rows,
    gap,
    rowGap,
    columnGap,
    autoFlow,
    autoRows,
    autoCols,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    templatePreset,
    className,
    children,
    style,
    ...rest
  }: GridProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const {
    cols: resolvedCols,
    rows: resolvedRows,
    gap: resolvedGap,
    rowGap: resolvedRowGap,
    columnGap: resolvedColumnGap,
    autoFlow: resolvedAutoFlow,
    autoRows: resolvedAutoRows,
    autoCols: resolvedAutoCols,
    alignItems: resolvedAlignItems,
    justifyItems: resolvedJustifyItems,
    alignContent: resolvedAlignContent,
    justifyContent: resolvedJustifyContent,
    templatePreset: resolvedTemplatePreset,
  } = useResponsiveProps({
    cols,
    rows,
    gap,
    rowGap,
    columnGap,
    autoFlow,
    autoRows,
    autoCols,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    templatePreset,
  });

  const { layout: layoutProps, rest: restProps } =
    splitLayoutProps(rest as Record<string, unknown>);

  const resolvedLayoutProps = generateLayoutClassNames(layoutProps);

  const resolvedStyles = cn(
    resolvedLayoutProps,
    gridVariants({
      cols: templatePreset ? undefined : (resolvedCols as ColRowNumber),
      rows: templatePreset ? undefined : (resolvedRows as ColRowNumber),
      gap: resolvedGap as SpacingType,
      rowGap: resolvedRowGap as SpacingType,
      columnGap: resolvedColumnGap as SpacingType,
      autoFlow: resolvedAutoFlow,
      autoRows: resolvedAutoRows,
      autoCols: resolvedAutoCols,
      alignItems: resolvedAlignItems,
      justifyItems: resolvedJustifyItems,
      alignContent: resolvedAlignContent,
      justifyContent: resolvedJustifyContent,
      templatePreset: resolvedTemplatePreset,
    }),
    className,
  );

  const restAny = normalizeProps(restProps as Record<string, unknown>);

  return (
    <Comp ref={ref} className={resolvedStyles} style={style} {...(restAny as any)}>
      {children}
    </Comp>
  );
};

export const Grid = forwardRefWithAs<GridOwnProps, AllowedGridElements>(_Grid);
(Grid as any).displayName = "Grid";

export default Grid;
