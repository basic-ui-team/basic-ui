import { forwardRef, useContext } from "react";
import { CardImageProps } from "../card.types";
import { CardContext } from "../Card";
import { Box, BoxProps } from "../../Box";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import {
  cardImageFitVariants,
  cardImageVariants,
  cardImageObjectFitClasses,
  cardImageAspectRatioClasses,
} from "../card.variants";

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
    // Apply disabled styles from Card context, but allow overriding via className
    const resolvedStyle = cn(
      cardImageFitVariants({
        objectFit: null,
        aspectRatio: null,
        rounded,
      }),
      getResponsiveClassNames(objectFit, (value) => cardImageObjectFitClasses[value]),
      getResponsiveClassNames(aspectRatio, (value) => cardImageAspectRatioClasses[value]),
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
