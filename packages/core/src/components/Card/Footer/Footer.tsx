import { forwardRef, useContext } from "react";
import { CardFooterProps } from "../card.types";
import { CardContext } from "../Card";
import { Box } from "@core/components";
import { cardSectionVariants } from "../card.variants";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";

export const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ variant = "default", sticky = false, className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const resolved = useResponsiveProps({
      variant,
      sticky,
    });

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="footer"
        ref={ref}
        className={cn(
          cardSectionVariants({
            variant: resolved.variant,
            sticky: resolved.sticky,
            disabled,
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);

CardFooter.displayName = "Card.Footer";
