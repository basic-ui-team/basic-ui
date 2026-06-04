import { useResponsiveProps } from "@core/hooks";
import { AllowedSpinnerElements, SpinnerOwnProps, SpinnerProps } from "./spinner.types";
import { PolymorphicRef } from "@core/types/props";
import { Box, BoxProps } from "../Box";
import { spinnerVariants } from "./spinner.variants";
import { cn, forwardRefWithAs } from "@core/lib";

export const _Spinner = <As extends AllowedSpinnerElements = "div">(
  {
    as,
    size = "md",
    color = "default",
    visible = true,
    ariaLabel,
    m = "unset",
    mx = "unset",
    my = "unset",
    mb = "unset",
    ml = "unset",
    mr = "unset",
    mt = "unset",
    className,
    style,
    ...rest
  }: SpinnerProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = as || ("div" as AllowedSpinnerElements);

  const { size: resolvedSize, color: resolvedColor } = useResponsiveProps({ size, color });

  if (!visible) {
    return null;
  }

  return (
    <Box
      as={Comp}
      m={m}
      mx={mx}
      my={my}
      mb={mb}
      ml={ml}
      mr={mr}
      mt={mt}
      ref={ref}
      role="status"
      aria-label={ariaLabel || "Loading"}
      aria-busy="true"
      className={cn(
        spinnerVariants({
          size: resolvedSize,
          color: resolvedColor,
        }),
        className,
      )}
      style={style}
      {...(rest as BoxProps<As>)}
    />
  );
};

export const Spinner = forwardRefWithAs<SpinnerOwnProps, AllowedSpinnerElements>(_Spinner);

(Spinner as unknown as { displayName: string }).displayName = "Spinner";
