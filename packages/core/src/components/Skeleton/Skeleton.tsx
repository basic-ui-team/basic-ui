import { AllowedSkeletonComponent, SkeletonOwnProps, SkeletonProps } from "./skeleton.types";
import { cn, forwardRefWithAs } from "@core/lib";
import { PolymorphicRef } from "@core/types/props";
import { skeletonVariants } from "./skeleton.variants";
import { Box, BoxProps } from "../Box";

export const _Skeleton = <As extends AllowedSkeletonComponent = "div">(
  { as, variant = "text", animated = false, className, style, ...rest }: SkeletonProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = (as || "div") as As;

  const resolvedStyles = cn(skeletonVariants({ variant, animated: animated }), className);

  return (
    <Box as={Comp} ref={ref} className={resolvedStyles} style={style} {...(rest as BoxProps<As>)} />
  );
};
/**
 * Skeleton component for displaying loading placeholders. Supports text, rectangular, and circular variants, with optional animation.
 */
export const Skeleton = forwardRefWithAs<SkeletonOwnProps, AllowedSkeletonComponent>(_Skeleton);
(Skeleton as unknown as { displayName?: string }).displayName = "Skeleton";
