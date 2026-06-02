import { CommonProps, PropsWithAs } from "@core/types/props";
import type { LayoutProps } from "@core/lib/layout/layout.types";
import { ResponsiveValue } from "@core/hooks";
import { ElementType } from "react";

export interface BoxOwnProps extends LayoutProps, CommonProps {
  display?: ResponsiveValue<"block" | "inline-block" | "inline" | "none">;
}

export type BoxProps<As extends ElementType = "div"> = PropsWithAs<BoxOwnProps, As>;

export default BoxOwnProps;
