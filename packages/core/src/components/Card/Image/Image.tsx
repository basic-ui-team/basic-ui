import { forwardRef, useContext } from "react";
import { CardImageProps } from "../card.types";
import { CardContext } from "../Card";
import { Image } from "@core/components/Image";

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ as, className, ...rest }: CardImageProps, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    return (
      <Image
        as={as}
        ref={ref}
        className={className}
        {...rest}
        // If the card is disabled, we want to apply a grayscale filter to the image to visually indicate the disabled state. This is a common UI pattern for disabled images.
        style={{
          filter: disabled ? "grayscale(100%)" : undefined,
          ...rest.style, // Allow overriding the filter via the style prop if needed
        }}
      />
    );
  },
);
