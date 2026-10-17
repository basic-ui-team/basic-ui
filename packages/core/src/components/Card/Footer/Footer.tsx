import { forwardRef, useContext } from "react";
import { CardFooterProps } from "../card.types";
import { CardContext } from "../Card";
import { Box } from "../../Box";
import { cardSectionVariants, cardSectionSpacingClasses } from "../card.variants";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";

export const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ variant = "default", sticky = false, className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="footer"
        ref={ref}
        className={cn(
          cardSectionVariants({
            variant: null,
            sticky,
            disabled,
          }),
          getResponsiveClassNames(variant, (value) => cardSectionSpacingClasses[value]),
          className,
        )}
        {...rest}
      />
    );
  },
);

CardFooter.displayName = "Card.Footer";
