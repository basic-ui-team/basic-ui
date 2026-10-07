import {
  useAriaIds,
  useControllableState,
  useResponsiveProps,
  cn,
  forwardRefWithAs,
} from "@basic-ui/react-utilities";
import { PolymorphicRef } from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../Box";
import { AllowedToggleElements, ToggleOwnProps, ToggleProps } from "./toggle.types";
import { toggleVariants } from "./toggle.variants";

/**
 * Toggle (switch) component for binary on/off choices.
 *
 * Features:
 * - Controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) modes via `useControllableState`
 * - Label and description wiring via `useAriaIds`, composing with Field conventions (#56)
 * - `role="switch"` with `aria-checked`; Space/Enter activation comes free from the native button
 * - Sizes and intent variants via CVA on basic-ui tokens
 *
 * @example
 * // Uncontrolled
 * <Toggle defaultValue aria-label="Notifications" />
 *
 * // Controlled with external label
 * <Toggle value={on} onChange={setOn} aria-labelledby="my-label" />
 */
export const Toggle = forwardRefWithAs<ToggleOwnProps, AllowedToggleElements>(
  <As extends AllowedToggleElements = "button">(
    {
      as,
      value,
      defaultValue = false,
      onChange,
      size = "md",
      color = "primary",
      disabled = false,
      className,
      onClick,
      ...rest
    }: ToggleProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const [checked, setChecked] = useControllableState({
      value,
      defaultValue,
      onChange,
    });
    const { size: resolvedSize } = useResponsiveProps({ size });
    const { id } = useAriaIds({ prefix: "toggle" });
    return (
      <Box
        as={(as || "button") as As}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-checked={checked || undefined}
        className={cn(
          toggleVariants({
            size: resolvedSize,
            color,
            checked: Boolean(checked),
            disabled,
          }),
          className,
        )}
        id={id}
        {...(rest as BoxProps<As>)}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          setChecked((prev) => !prev);
          onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
      >
        <Box as="span" data-slot="thumb" aria-hidden="true" />
      </Box>
    );
  },
);
