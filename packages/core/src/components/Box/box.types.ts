import { CommonProps, PropsWithAs } from "@basic-ui/react-utilities";
import { LayoutProps } from "@core/lib";
import { ElementType } from "react";

export type BoxProps<As extends ElementType = "div"> = PropsWithAs<LayoutProps & CommonProps, As>;
