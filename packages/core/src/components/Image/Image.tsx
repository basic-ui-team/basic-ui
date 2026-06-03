import { useResponsiveProps } from "@core/hooks";
import { cn, forwardRefWithAs } from "@core/lib";
import { Box, BoxProps } from "@core/components";
import { imageVariants } from "./image.variants";
import { AllowedImageElements, ImageOwnProps, ImageProps } from "./image.types";
import { PolymorphicRef } from "@core/types/props";

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
  const {
    objectFit: resolvedObjectFit,
    aspectRatio: resolvedAspectRatio,
    rounded: resolvedRounded,
  } = useResponsiveProps({ objectFit, aspectRatio, rounded });

  const Comp = as ? as : sources && sources.length > 0 ? "picture" : "img";

  const isPicture = Comp === "picture";

  // Split styles: Wrapper gets layout, Inner gets object-fit
  const wrapperClasses = cn(
    resolvedAspectRatio ? imageVariants({ aspectRatio: resolvedAspectRatio }) : "",
    resolvedRounded ? imageVariants({ rounded: resolvedRounded }) : "",
    className,
  );

  const innerImgClasses = cn(
    imageVariants({ objectFit: resolvedObjectFit }),
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
          objectFit: resolvedObjectFit,
          aspectRatio: resolvedAspectRatio,
          rounded: resolvedRounded,
        }),
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
 * - Rounded corners with responsive values
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
