import { forwardRef, useContext } from "react";
import { CardImageProps } from "../card.types";
import { CardContext } from "../Card";
import { Box, BoxProps } from "../../Box";
import { cn, useResponsiveProps } from "@basic-ui/react-utilities";
import { cardImageFitVariants, cardImageVariants } from "../card.variants";

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      src,
      alt,
      objectFit = "cover",
      aspectRatio = "auto",
      loading = "lazy",
      decoding = "auto",
      rounded,
      className,
      ...rest
    }: CardImageProps,
    ref,
  ) => {
    const ctx = useContext(CardContext);
    const disabled = ctx?.disabled || false;
    const { objectFit: resolvedObjectFit, aspectRatio: resolvedAspectRatio, rounded: resolvedRounded } =
      useResponsiveProps({ objectFit, aspectRatio, rounded });
    // Apply disabled styles from Card context, but allow overriding via className
    const resolvedStyle = cn(
      cardImageFitVariants({
        objectFit: resolvedObjectFit,
        aspectRatio: resolvedAspectRatio,
        rounded: resolvedRounded,
      }),
      cardImageVariants({
        disabled,
      }),
      className,
    );
    return (
      <Box
        as="img"
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={resolvedStyle}
        {...(rest as BoxProps<"img">)}
      />
    );
  },
);
