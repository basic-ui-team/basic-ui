import { forwardRef, useContext } from "react";
import { CardFooterProps } from "../card.types";
import { CardContext } from "../Card";
import { Box } from "@core/components";
import { cardSectionVariants } from "../card.variants";
import { cn } from "@core/lib";
import { useResponsiveProps } from "@core/hooks";

export const Footer = forwardRef<HTMLElement, CardFooterProps>(
  ({ variant = "default", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const { variant: resolvedVariant } = useResponsiveProps({
      variant,
    });

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="footer"
        ref={ref}
        className={cn(
          cardSectionVariants({
            variant: resolvedVariant,
            disabled,
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);

(Footer as any).displayName = "Card.Footer";
