import { forwardRef, useContext } from "react";
import { CardImageProps } from "../card.types";
import { CardContext } from "../Card";
import { Image } from "@core/components/Image";
import { cn } from "@core/lib";
import { cardImageVariants } from "../card.variants";

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ as, className, ...rest }: CardImageProps, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    // Apply disabled styles from Card context, but allow overriding via className
    const resolvedStyle = cn(
      cardImageVariants({
        disabled,
      }),
      className,
    )

    return (
      <Image
        as={as}
        ref={ref}
        className={resolvedStyle}
        {...rest}
      />
    );
  },
);
