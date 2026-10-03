import { CommonProps, PropsWithAs } from "@basic-ui/react-utilities";
import type { LayoutProps } from "@core/lib/layout";
import { ResponsiveValue } from "@basic-ui/react-utilities";
import { ElementType } from "react";

export interface BoxOwnProps extends LayoutProps, CommonProps {
  display?: ResponsiveValue<"block" | "inline-block" | "inline" | "none">;
}

export type BoxProps<As extends ElementType = "div"> = PropsWithAs<BoxOwnProps, As>;

export default BoxOwnProps;
