import { ResponsiveValue } from "@core/index";
import { BuiltInSemanticColors } from "@core/theme";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

type buttonVariants = "solid" | "ghost" | "outline" | "link";
type buttonSizes = "sm" | "md" | "lg";
type buttonColors = BuiltInSemanticColors;
export type AllowedButtonElements = "button" | "a";

export interface ButtonOwnProps extends CommonProps {
  variant?: buttonVariants;
  size?: ResponsiveValue<buttonSizes>;
  color?: buttonColors;
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  loadingText?: string;
}

export type ButtonProps<As extends AllowedButtonElements = "button"> = RestrictedPropsWithAs<
  ButtonOwnProps,
  As
>;
