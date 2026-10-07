import { ResponsiveValue } from "@basic-ui/react-utilities";
import { BuiltInSemanticColors } from "@core/theme";
import { CommonProps, RestrictedPropsWithAs } from "@basic-ui/react-utilities";

type toggleSizes = "sm" | "md" | "lg";
type toggleColors = Exclude<BuiltInSemanticColors, "default" | "muted">;

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
  /** Semantic color applied when the switch is on. */
  color?: toggleColors;
  /** If true, disables the toggle. */
  disabled?: boolean;
}

export type ToggleProps<As extends AllowedToggleElements = "button"> =
  RestrictedPropsWithAs<ToggleOwnProps, As>;
