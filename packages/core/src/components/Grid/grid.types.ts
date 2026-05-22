import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export type AllowedGridElements = "div" | "section" | "article" | "main" | "aside" | "nav";

const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
 const COL_ROW_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const justifyContentValues = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
  "stretch",
] as const;
const alignItemsValues = ["start", "end", "center", "stretch"] as const;
const justifyItemsValues = ["start", "end", "center", "stretch"] as const;
const alignContentValues = [
  "start",
  "end",
  "center",
  "stretch",
  "between",
  "around",
  "evenly",
] as const;
const autoFlowValues = ["row", "column", "dense"] as const;
const autoColsRowsValues = ["min", "max", "fr"] as const;
const gridTemplatePresetValues = ["sidebar", "hero", "masonry", "card-list", "symmetric", "asymmetric"] as const;

export type SpacingType = (typeof spacingValues)[number];
export type ColRowNumber = (typeof COL_ROW_NUMBERS)[number];
export type JustifyOption = (typeof justifyContentValues)[number];
export type AlignOption = (typeof alignItemsValues)[number];
export type JustifyItemsOption = (typeof justifyItemsValues)[number];
export type AlignContentOption = (typeof alignContentValues)[number];
export type AutoFlowOption = (typeof autoFlowValues)[number];
export type AutoColsRowsOption = (typeof autoColsRowsValues)[number];
export type GridTemplatePresetOption = (typeof gridTemplatePresetValues)[number];

export interface GridOwnProps extends CommonProps {
  /** Number of columns in the grid (1-12). For custom templates use `templateCols` or `style`/`className`. */
  cols?: ResponsiveValue<ColRowNumber>;
  /** Number of rows in the grid (1-12). For custom templates use `templateRows` or `style`/`className`. */
  rows?: ResponsiveValue<ColRowNumber>;
  /** gap controls the gap between grid items.*/
  gap?: ResponsiveValue<SpacingType>;
  /** rowGap controls the gap between grid rows.*/
  rowGap?: ResponsiveValue<SpacingType>;
  /** columnGap controls the gap between grid columns.*/
  columnGap?: ResponsiveValue<SpacingType>;
  /** autoFlow controls how auto-placed items are flowed into the grid */
  autoFlow?: ResponsiveValue<AutoFlowOption>;
  /** autoRows controls the size of implicitly created grid rows */
  autoRows?: ResponsiveValue<AutoColsRowsOption | true>;
  /** autoCols controls the size of implicitly created grid columns */
  autoCols?: ResponsiveValue<AutoColsRowsOption | true>;
  /** alignItems controls the alignment of items along the cross axis */
  alignItems?: ResponsiveValue<AlignOption>;
  /** justifyContent controls the alignment of items along the main axis */
  justifyContent?: ResponsiveValue<JustifyOption>;
  /** justifyItems controls the alignment of items within their grid area along the inline axis */
  justifyItems?: ResponsiveValue<JustifyItemsOption>;
  /** alignContent controls the alignment of the grid's content along the block axis */
  alignContent?: ResponsiveValue<AlignContentOption>;
  /** Preset grid templates for common layouts. If set, overrides `cols` and `rows`. */
  templatePreset?: ResponsiveValue<GridTemplatePresetOption>;
}

export type GridProps<T extends AllowedGridElements = "div"> = RestrictedPropsWithAs<
  GridOwnProps,
  T
>;
