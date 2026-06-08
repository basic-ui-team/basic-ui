import { LayoutProps } from "@core/lib/layout";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props";

export type AllowedSkeletonComponent = "div" | "span";
export type SkeletonVariant = "text" | "rectangular" | "circular";

export interface SkeletonOwnProps
  extends CommonProps,
    Pick<LayoutProps, "w" | "h" | "wMin" | "hMin" | "wMax" | "hMax"> {
  /** The skeleton variant to display. */
  variant?: SkeletonVariant;
  /** Whether the skeleton should be animated. */
  animated?: boolean;
}

export type SkeletonProps<As extends AllowedSkeletonComponent = "div"> = RestrictedPropsWithAs<
  SkeletonOwnProps,
  As
>;
