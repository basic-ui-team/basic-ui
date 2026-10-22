import {
  cn,
  forwardRefWithAs,
  normalizeProps,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import {
  type GridProps,
  type AllowedGridElements,
  type GridOwnProps,
} from "./grid.types";
import { gridVariants } from "./grid.variants";
import { Box, BoxProps } from "../Box";
import { getGridTemplateClasses } from "./grid-template-utils";

const _Grid = <As extends AllowedGridElements = "div">(
  {
    as,
    cols,
    rows,
    autoFlow = "row",
    autoRows,
    autoCols,
    alignItems = "stretch",
    justifyItems = "stretch",
    alignContent = "stretch",
    justifyContent = "start",
    templatePreset,
    className,
    children,
    style,
    ...rest
  }: GridProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const resolvedStyles = cn(
    "grid",
    getGridTemplateClasses({ cols, rows, templatePreset }),
    getResponsiveClassNames(autoFlow, (value) => gridVariants({ autoFlow: value })),
    getResponsiveClassNames(autoRows, (value) => gridVariants({ autoRows: value })),
    getResponsiveClassNames(autoCols, (value) => gridVariants({ autoCols: value })),
    getResponsiveClassNames(alignItems, (value) => gridVariants({ alignItems: value })),
    getResponsiveClassNames(justifyItems, (value) => gridVariants({ justifyItems: value })),
    getResponsiveClassNames(alignContent, (value) => gridVariants({ alignContent: value })),
    getResponsiveClassNames(justifyContent, (value) => gridVariants({ justifyContent: value })),
    className,
  );

  const restAny = normalizeProps(rest as Record<string, unknown>);

  return (
    <Box
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      style={style}
      {...(restAny as BoxProps<As>)}
    >
      {children}
    </Box>
  );
};

export const Grid = forwardRefWithAs<GridOwnProps, AllowedGridElements>(_Grid);
(Grid as unknown as { displayName?: string }).displayName = "Grid";

export default Grid;
