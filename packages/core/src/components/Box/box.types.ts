import { CommonProps, PropsWithAs } from "@basic-ui/react-utilities";
import type { LayoutProps } from "@core/lib/layout";
import { ElementType } from "react";

export type BoxProps<As extends ElementType = "div"> = PropsWithAs<LayoutProps & CommonProps, As>;
