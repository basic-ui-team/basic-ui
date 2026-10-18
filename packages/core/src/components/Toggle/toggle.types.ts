import { CommonProps, ResponsiveValue, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import { PaletteColor } from "../../lib/colorRecipes/colorRecipes";

type toggleSizes = "sm" | "md" | "lg";

export type AllowedToggleElements = "button";

export interface ToggleOwnProps extends CommonProps {
  /** Whether the switch is on. Uncontrolled when `value` is omitted. */
  value?: boolean;
  /** Initial on/off state for uncontrolled usage. */
  defaultValue?: boolean;
  /** Called whenever the state changes, in both controlled and uncontrolled modes. */
  onChange?: (value: boolean) => void;
  /** Size of the toggle, which can be responsive. */
  size?: ResponsiveValue<toggleSizes>;
  /** Palette family applied to the track when the switch is on. @default "primary" */
  color?: PaletteColor;
  /** If true, disables the toggle. */
  disabled?: boolean;
}

export type ToggleProps<As extends AllowedToggleElements = "button"> = RestrictedPropsWithAs<
  ToggleOwnProps,
  As
>;
