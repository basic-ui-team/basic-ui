import {
  cn,
  forwardRefWithAs,
  getResponsiveClassNames,
  PolymorphicRef,
} from "@basic-ui/react-utilities";
import { AllowedSpinnerElements, SpinnerOwnProps, SpinnerProps } from "./spinner.types";
import { Box, BoxProps } from "../Box";
import { spinnerSizeClasses, spinnerVariants } from "./spinner.variants";

export const _Spinner = <As extends AllowedSpinnerElements = "div">(
  {
    as,
    size = "md",
    color = "default",
    visible = true,
    ariaLabel,
    className,
    style,
    ...rest
  }: SpinnerProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = as || ("div" as AllowedSpinnerElements);

  if (!visible) {
    return null;
  }

  return (
    <Box
      as={Comp}
      ref={ref}
      role="status"
      aria-label={ariaLabel || "Loading"}
      aria-busy="true"
      className={cn(
        spinnerVariants({ color }),
        getResponsiveClassNames(size, (value) => spinnerSizeClasses[value]),
        className,
      )}
      style={style}
      {...(rest as BoxProps<As>)}
    />
  );
};

export const Spinner = forwardRefWithAs<SpinnerOwnProps, AllowedSpinnerElements>(_Spinner);

(Spinner as unknown as { displayName: string }).displayName = "Spinner";
