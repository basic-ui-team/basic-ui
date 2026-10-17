import { BREAKPOINT_ORDER, getResponsiveClassNames, type Breakpoint } from "@basic-ui/react-utilities";
import type { ColRowNumber, GridOwnProps, GridTemplatePresetOption } from "./grid.types";
import { gridVariants } from "./grid.variants";

export function getGridTemplateClasses({ cols, rows, templatePreset }: Pick<GridOwnProps, "cols" | "rows" | "templatePreset">) {
  let currentCols: ColRowNumber | undefined;
  let currentRows: ColRowNumber | undefined;
  let currentPreset: GridTemplatePresetOption = "none";
  const classes: { base: string } & Partial<Record<Breakpoint, string>> = { base: "" };
  for (const breakpoint of BREAKPOINT_ORDER) {
    const nextCols = typeof cols === "object" ? cols[breakpoint] : breakpoint === "base" ? cols : undefined;
    const nextRows = typeof rows === "object" ? rows[breakpoint] : breakpoint === "base" ? rows : undefined;
    const nextPreset = typeof templatePreset === "object" ? templatePreset[breakpoint] : breakpoint === "base" ? templatePreset : undefined;
    if (nextCols === undefined && nextRows === undefined && nextPreset === undefined) continue;
    currentCols = nextCols ?? currentCols;
    currentRows = nextRows ?? currentRows;
    currentPreset = nextPreset ?? currentPreset;
    classes[breakpoint] = currentPreset === "none"
      ? `${currentCols ? gridVariants({ cols: currentCols }) : "grid-cols-none"} ${currentRows ? gridVariants({ rows: currentRows }) : "grid-rows-none"}`
      : `${gridVariants({ templatePreset: currentPreset })} grid-rows-none`;
  }
  return getResponsiveClassNames(classes, (value) => value);
}
