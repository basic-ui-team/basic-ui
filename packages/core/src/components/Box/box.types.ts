import { CommonProps, PropsWithAs } from "@basic-ui/react-utilities";
import { ElementType } from "react";

export type BoxProps<As extends ElementType = "div"> = PropsWithAs<CommonProps, As>;
