/*
THINGS TO IMPLEMENT IN BUTTON:
- Basic button handling on click event
- Disabled state handling
- Loading state handling (with optional loading text and icon)
- Button as link. Currently link can only be an 'a' element but we'll actually want to do what Pagination is doing, supporting a LinkComponent. Need to see if we can share logic.
- Accessibility: aria-disabled for disabled state, aria-busy for loading state, proper role and keyboard handling for non-button elements
- Styling is handled via cva variants, but we need to make sure to cover all combinations of variant, color, size, disabled, and loading states. Also need to handle focus and active states for accessibility.
- Support for polymorphic 'as' prop to render different elements (e.g. 'button', 'a', 'div' etc.) while maintaining correct behavior and accessibility.
 */

import { AllowedButtonElements, ButtonOwnProps, ButtonProps } from "./button.types";
import { cn, forwardRefWithAs } from "@core/lib";
import { PolymorphicRef } from "@core/types/props";
import { buttonVariants, buttonIconVariants } from "./button.variants";
import { Box, BoxProps } from "../Box";
import { Spinner } from "../Spinner";
import { useResponsiveProps } from "@core/hooks";
import { Flex } from "../Flex";
import { Text } from "../Text";

export const _Button = <As extends AllowedButtonElements = "button">(
  {
    as,
    variant = "solid",
    color = "default",
    size = "md",
    disabled = false,
    loading = false,
    loadingText,
    loadingIcon,
    className,
    children,
    ...rest
  }: ButtonProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "button") as As;

  const { size: resolvedSize } = useResponsiveProps({ size });

  const resolvedStyles = cn(
    buttonVariants({ variant, color, size: resolvedSize, disabled, loading }),
    className,
  );

  const isButtonElement = Comp === "button";

  const boxProps: BoxProps<As> = { ...(rest as BoxProps<As>) } as BoxProps<As>;

  if (isButtonElement) {
    // native disabled attribute for button
    (boxProps as BoxProps<"button">).disabled = disabled || loading; // cast to button props to set disabled attribute
  } else {
    // non-button elements: provide aria-disabled and remove from tab order when disabled
    if (disabled || loading) {
      boxProps["aria-disabled"] = true;
      boxProps.tabIndex = -1;
    }
  }

  const renderLoader = () => {
    const iconNode = loadingIcon ? (
      loadingIcon
    ) : (
      <Spinner size="sm" ariaLabel={loadingText ? `${loadingText} loading` : "Loading"} />
    );

    let customIconStyles;

    if (loadingIcon) {
      // If a custom loading icon is provided, we may need to apply custom styles to ensure it fits well within the button. For example, we might want to set its size based on the button size.
      customIconStyles = buttonIconVariants({ size: resolvedSize });
    }

    return (
      <Flex justify="center" align="center" gap="md">
        <Box className={cn(customIconStyles)}>{iconNode}</Box>
        {loadingText && <Text color="inherit" weight="medium">{loadingText}</Text>}
      </Flex>
    );
  };

  return (
    <Box
      as={Comp}
      ref={ref}
      className={resolvedStyles}
      aria-busy={loading}
      {...(boxProps as BoxProps<As>)}
    >
      {loading ? renderLoader() : children}
    </Box>
  );
};

export const Button = forwardRefWithAs<ButtonOwnProps, AllowedButtonElements>(_Button);
