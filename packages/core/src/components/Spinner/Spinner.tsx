import {
  cn,
  forwardRefWithAs,
  getResponsiveClassNames,
  PolymorphicRef,
} from "@basic-ui/react-utilities";
import { AllowedSpinnerElements, SpinnerOwnProps, SpinnerProps } from "./spinner.types";
import { Box, BoxProps } from "../Box";
import { spinnerSizeClasses, spinnerVariants, spinnerPaletteRecipe } from "./spinner.variants";
import { cr, isPaletteColor } from "../../lib/colorRecipes/colorRecipes";

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

  const palette = isPaletteColor(color);
  const cooked = palette ? cr(color, spinnerPaletteRecipe) : null;

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
        spinnerVariants({ color: palette ? "palette" : color }),
        getResponsiveClassNames(size, (value) => spinnerSizeClasses[value]),
        className,
      )}
      style={{ ...cooked?.style, ...style }}
      {...(rest as BoxProps<As>)}
    />
  );
};

export const Spinner = forwardRefWithAs<SpinnerOwnProps, AllowedSpinnerElements>(_Spinner);

(Spinner as unknown as { displayName: string }).displayName = "Spinner";
