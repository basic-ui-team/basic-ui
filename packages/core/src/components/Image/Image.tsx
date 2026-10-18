import {
  cn,
  forwardRefWithAs,
  PolymorphicRef,
  getResponsiveClassNames,
} from "@basic-ui/react-utilities";
import { Box, BoxProps } from "../Box";
import { imageVariants, imageObjectFitClasses, imageAspectRatioClasses } from "./image.variants";
import { AllowedImageElements, ImageOwnProps, ImageProps } from "./image.types";

export const _Image = <As extends AllowedImageElements = "img">(
  {
    as,
    src,
    alt,
    sources,
    objectFit = "cover",
    aspectRatio = "auto",
    loading = "lazy",
    decoding = "auto",
    rounded,
    className,
    ...rest
  }: ImageProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Comp = as ? as : sources && sources.length > 0 ? "picture" : "img";

  const isPicture = Comp === "picture";

  // Split styles: Wrapper gets layout, Inner gets object-fit
  const wrapperClasses = cn(
    imageVariants({ objectFit: null, aspectRatio: null, rounded }),
    getResponsiveClassNames(aspectRatio, (value) => imageAspectRatioClasses[value]),
    className,
  );

  const innerImgClasses = cn(
    getResponsiveClassNames(objectFit, (value) => imageObjectFitClasses[value]),
    "w-full h-full", // Critical for picture element
  );

  if (isPicture) {
    return (
      <Box as={Comp} ref={ref} className={wrapperClasses} {...(rest as BoxProps<As>)}>
        {sources?.map((s, i) => (
          <source key={i} srcSet={s.srcSet} media={s.media} type={s.type} sizes={s.sizes} />
        ))}
        <Box
          as="img"
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={innerImgClasses}
        />
      </Box>
    );
  }

  return (
    <Box
      as={Comp}
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(
        imageVariants({
          objectFit: null,
          aspectRatio: null,
          rounded,
        }),
        getResponsiveClassNames(objectFit, (value) => imageObjectFitClasses[value]),
        getResponsiveClassNames(aspectRatio, (value) => imageAspectRatioClasses[value]),
        className,
      )}
      {...(rest as BoxProps<As>)}
    />
  );
};

/**
 * Image component for rendering responsive images with art-direction support.
 *
 * Supports both `img` and `picture` elements for flexible image rendering with:
 * - Responsive sizing through aspect-ratio presets
 * - Object-fit variants (cover, contain, fill, none, scale-down)
 * - Art-direction sources for responsive images
 * - Scalar rounded corners
 * - Performance optimizations (lazy loading, async decoding)
 *
 * @example
 * // Basic image
 * <Image src="/photo.jpg" alt="A photo" />
 *
 * @example
 * // Responsive picture element
 * <Image
 *   as="picture"
 *   src="/fallback.jpg"
 *   alt="Responsive"
 *   sources={[{ srcSet: "/small.jpg", media: "(max-width: 600px)" }]}
 * />
 *
 * @example
 * // With aspect ratio and object-fit
 * <Image
 *   src="/photo.jpg"
 *   alt="A photo"
 *   aspectRatio="video"
 *   objectFit="cover"
 *   rounded="lg"
 * />
 */
export const Image = forwardRefWithAs<ImageOwnProps, AllowedImageElements>(_Image);
(Image as any).displayName = "Image";
