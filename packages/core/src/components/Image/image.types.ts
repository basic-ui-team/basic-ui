import { ImgHTMLAttributes } from "react";
import { CommonProps, RestrictedPropsWithAs } from "@core/types/props"; // Your existing types
import { ResponsiveValue } from "@core/hooks";
import { LayoutProps } from "../../lib/layout";

export type ObjectFitType = "cover" | "contain" | "fill" | "none" | "scale-down";

export type AspectRatioType = "square" | "video" | "landscape" | "portrait" | "auto";

export interface ImageOwnProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height" | "src" | "alt">,
    CommonProps,
    LayoutProps {
  /** The source URL of the image. */
  src: string;
  /** Alt text for accessibility. */
  alt: string;
  /** Art-direction sources for a `<picture>` element. */
  sources?: ImageSource[];
  /** How the image should scale to fit its container. */
  objectFit?: ResponsiveValue<ObjectFitType>;
  /** Aspect ratio preset. */
  aspectRatio?: ResponsiveValue<AspectRatioType>;
  /** Loading strategy (lazy, eager). */
  loading?: "lazy" | "eager";
  /** Decoding strategy (async, sync, auto). */
  decoding?: "async" | "sync" | "auto";
  rounded?: ResponsiveValue<"none" | "sm" | "md" | "lg" | "xl" | "full">;
}

export type ImageSource = {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
};

export type AllowedImageElements = "img" | "picture";

export type ImageProps<As extends AllowedImageElements = "img"> = RestrictedPropsWithAs<
  ImageOwnProps,
  As
>;