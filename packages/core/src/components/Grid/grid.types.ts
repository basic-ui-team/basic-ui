import { ResponsiveValue } from "@core/hooks";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export type AllowedGridElements = "div" | "section" | "article" | "main" | "aside" | "nav";
export type AllowedGridItems = "div" | "article" | "section" | "main" | "aside" | "nav";

export const COL_ROW_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const justifyContentValues = ["start", "end", "center", "between", "around", "evenly", "stretch"];
const alignItemsValues = ["start", "end", "center", "stretch"];
const justifyItemsValues = ["start", "end", "center", "stretch"];
const alignContentValues = ["start", "end", "center", "stretch", "between", "around", "evenly"];
const autoFlowValues = ["row", "column", "dense"];

export type ColRowNumber = (typeof COL_ROW_NUMBERS)[number];
export type JustifyOption = (typeof justifyContentValues)[number];
export type AlignOption = (typeof alignItemsValues)[number];
export type JustifyItemsOption = (typeof justifyItemsValues)[number];
export type AlignContentOption = (typeof alignContentValues)[number];
export type AutoFlowOption = (typeof autoFlowValues)[number];

export interface GridOwnProps extends CommonProps {
  /** Number of columns in the grid. Can be a number (1-12) or a custom string value. */
  cols?: ResponsiveValue<ColRowNumber | string>;
  /** Number of rows in the grid. Can be a number (1-12) or a custom string value. */
  rows?: ResponsiveValue<ColRowNumber | string>;
  /** Custom grid-template-columns value (e.g. "200px 1fr 2fr"). Overrides `cols` when provided. */
  templateCols?: ResponsiveValue<string>;
  /** Custom grid-template-rows value (e.g. "100px auto"). Overrides `rows` when provided. */
  templateRows?: ResponsiveValue<string>;
  /** gap controls the gap between grid items in both dimensions */
  gap?: ResponsiveValue<number | string>;
  /** rowGap controls the gap between grid rows */
  rowGap?: ResponsiveValue<number | string>;
  /** columnGap controls the gap between grid columns */
  columnGap?: ResponsiveValue<number | string>;
  /** autoFlow controls how auto-placed items are flowed into the grid */
  autoFlow?: ResponsiveValue<AutoFlowOption>;
  /** autoRows controls the size of implicitly created grid rows */
  autoRows?: ResponsiveValue<number | string>;
  /** autoCols controls the size of implicitly created grid columns */
  autoCols?: ResponsiveValue<number | string>;
  /** alignItems controls the alignment of items along the cross axis */
  alignItems?: ResponsiveValue<AlignOption>;
  /** justifyContent controls the alignment of items along the main axis */
  justifyContent?: ResponsiveValue<JustifyOption>;
  /** justifyItems controls the alignment of items within their grid area along the inline axis */
  justifyItems?: ResponsiveValue<Omit<JustifyItemsOption, "baseline">>;
  /** alignContent controls the alignment of the grid's content along the block axis */
  alignContent?: ResponsiveValue<AlignContentOption>;
}

export type GridProps<T extends AllowedGridElements = "div"> = RestrictedPropsWithAs<
  GridOwnProps,
  T
>;
