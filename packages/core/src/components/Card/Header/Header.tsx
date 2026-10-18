import { useContext, forwardRef } from "react";
import { CardHeaderProps } from "../card.types";
import { CardContext } from "../Card";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import { cardSectionVariants, cardSectionSpacingClasses } from "../card.variants";
import { Box } from "../../Box";

// 1. Remove generic <As> and use standard forwardRef
export const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ variant = "default", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="header"
        ref={ref}
        className={cn(
          cardSectionVariants({
            variant: null,
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

CardHeader.displayName = "Card.Header";
