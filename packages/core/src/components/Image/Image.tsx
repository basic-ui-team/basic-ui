import { useResponsiveProps } from "@core/hooks";
import { cn, forwardRefWithAs } from "@core/lib";
import { Box, BoxProps } from "@core/components";
import { imageVariants } from "./image.variants";
import { AllowedImageElements, ImageOwnProps, ImageProps } from "./image.props";
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

export const Image = forwardRefWithAs<ImageOwnProps, AllowedImageElements>(_Image);
(Image as any).displayName = "Image";
