import { forwardRef, useContext } from "react";
import { CardImageProps } from "../card.types";
import { useResponsiveProps } from "@core/hooks";
import { cn } from "@core/lib";
import { CardContext } from "../Card";
import { cardImageVariants } from "../card.variants";

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ src, alt, objectFit = "cover", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    const { objectFit: resolvedObjectFit } = useResponsiveProps({
      objectFit,
    });

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          cardImageVariants({
            objectFit: resolvedObjectFit,
            disabled,
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
