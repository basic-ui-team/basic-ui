import { useResponsiveProps } from "@core/hooks";
import { cn, forwardRefWithAs, normalizeProps } from "@core/lib";
import { Box, BoxProps } from "@core/components";
import { imageVariants } from "./image.variants";
import { AllowedImageElements, ImageOwnProps, ImageProps } from "./image.props";
import { PolymorphicRef } from "@core/types/props";
import { splitLayoutProps, generateLayoutClassNames } from "../Layout/layout";
import type { LayoutProps } from "../Layout/layout.types";
import type { SyntheticEvent } from "react";

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

  // Separate layout props from other props so we can apply layout classes to
  // the wrapper (picture) and keep image-specific attributes on the <img>.
  const { layout: layoutProps, rest: restProps } = splitLayoutProps(
    rest as Record<string, unknown>,
  );
  const layoutClassNames = generateLayoutClassNames(layoutProps as LayoutProps);

  const wrapperClasses = cn(
    layoutClassNames,
    resolvedAspectRatio ? imageVariants({ aspectRatio: resolvedAspectRatio }) : "",
    resolvedRounded ? imageVariants({ rounded: resolvedRounded }) : "",
    className,
  );

  const innerImgClasses = cn(imageVariants({ objectFit: resolvedObjectFit }), "w-full h-full");

  const normalizedRest = normalizeProps(restProps as Record<string, unknown>);

  if (isPicture) {
    // Extract common image event handlers so they can be attached to the real <img>
    const { onLoad, onError, ...wrapperOnly } = normalizedRest as Record<string, unknown>;

    return (
      <Box as={Comp} ref={ref} className={wrapperClasses} {...(wrapperOnly as BoxProps<As>)}>
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
          onLoad={onLoad as unknown as (e: SyntheticEvent<HTMLImageElement>) => void}
          onError={onError as unknown as (e: SyntheticEvent<HTMLImageElement>) => void}
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
        layoutClassNames,
        className,
      )}
      {...(normalizedRest as BoxProps<As>)}
    />
  );
};

export const Image = forwardRefWithAs<ImageOwnProps, AllowedImageElements>(_Image);
(Image as unknown as { displayName?: string }).displayName = "Image";
