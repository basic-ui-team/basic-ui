import { AllowedButtonElements, ButtonOwnProps, ButtonProps } from "./button.types";
import { cn, forwardRefWithAs } from "@core/lib";
import { PolymorphicRef } from "@core/types/props";
import { buttonVariants, buttonIconVariants } from "./button.variants";
import { Box, BoxProps } from "../Box";
import { Spinner } from "../Spinner";
import { useResponsiveProps } from "@core/hooks";
import { Flex } from "../Flex";
import { Text } from "../Text";

/**
 * Button component with support for multiple variants, colors, sizes, and states.
 *
 * Features:
 * - Multiple variants: solid, ghost, outline, link
 * - Semantic color support (primary, secondary, error, success, warning, info, etc.)
 * - Responsive sizing (sm, md, lg)
 * - Loading state with optional loading text and custom icon
 * - Disabled state with proper accessibility attributes
 * - Polymorphic rendering as button or anchor element
 * - Support for custom link components (e.g., Next.js Link, React Router Link)
 *
 * @example
 * // Basic button
 * <Button variant="solid" color="primary">Click me</Button>
 *
 * // Loading state
 * <Button loading loadingText="Submitting">Submit</Button>
 *
 * // As anchor/link
 * <Button as="a" href="/page">Navigate</Button>
 *
 * // With custom link component (Next.js)
 * <Button as="a" linkComponent={NextLink} href="/page">Navigate</Button>
 */
export const Button = forwardRefWithAs<ButtonOwnProps, AllowedButtonElements>(
  <As extends AllowedButtonElements = "button">(
    {
      as,
      variant = "solid",
      color = "default",
      size = "md",
      disabled = false,
      loading = false,
      loadingText,
      loadingIcon,
      linkComponent,
      className,
      children,
      ...rest
    }: ButtonProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    // Use custom link component when rendering as 'a', otherwise use default 'as' prop
    const Comp = (as === "a" && linkComponent ? linkComponent : as || "button") as As;

    const { size: resolvedSize } = useResponsiveProps({ size });

    const resolvedStyles = cn(
      buttonVariants({ variant, color, size: resolvedSize, disabled, loading }),
      className,
    );

    const isButtonElement = Comp === "button";

    const boxProps: BoxProps<As> = { ...(rest as BoxProps<As>) } as BoxProps<As>;
    let restProps;

    if (isButtonElement) {
      const buttonProps = boxProps as BoxProps<"button">;
      buttonProps.disabled = disabled || loading;
      if (buttonProps.type === undefined) buttonProps.type = "button";
      restProps = { ...buttonProps };
    } else {
      // non-button elements: provide aria-disabled and remove from tab order when disabled
      if (disabled || loading) {
        boxProps["aria-disabled"] = true;
        boxProps.tabIndex = -1;
        const original = boxProps.onClick;
        boxProps.onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (disabled || loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          if (typeof original === "function") original(e as any); 
          // Hate this cast to any but BoxProps<As> doesn't know about onClick when As is not 'button' and I don't know how to type it without making BoxProps a discriminated union which would be a nightmare to maintain
        };
      }
      restProps = { ...boxProps };
    }

    const renderLoader = () => {
      const iconNode = loadingIcon ? (
        loadingIcon
      ) : (
        <Spinner size="sm" ariaLabel={loadingText ? `${loadingText} loading` : "Loading"} />
      );

      let customIconStyles;

      if (loadingIcon) {
        // If a custom loading icon is provided, apply size-based styles to ensure it fits well within the button
        customIconStyles = buttonIconVariants({ size: resolvedSize });
      }

      return (
        <Flex justify="center" align="center" gap="md">
          <Box className={cn(customIconStyles)}>{iconNode}</Box>
          {loadingText && (
            <Text color="inherit" weight="medium">
              {loadingText}
            </Text>
          )}
        </Flex>
      );
    };

    return (
      <Box
        as={Comp}
        ref={ref}
        className={resolvedStyles}
        aria-busy={loading}
        {...(restProps as BoxProps<As>)}
      >
        {loading ? renderLoader() : children}
      </Box>
    );
  },
);
