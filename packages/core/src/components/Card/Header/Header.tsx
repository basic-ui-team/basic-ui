import { useContext, forwardRef } from "react";
import { CardHeaderProps } from "../card.types";
import { CardContext } from "../Card";
import { useResponsiveProps } from "@basic-ui/react-utilities";
import { cn } from "@basic-ui/react-utilities";
import { cardSectionVariants } from "../card.variants";
import { Box } from "../../Box";

// 1. Remove generic <As> and use standard forwardRef
export const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ variant = "default", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const resolvedProps = useResponsiveProps({
      variant,
    });

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="header"
        ref={ref}
        className={cn(
          cardSectionVariants({
            variant: resolvedProps.variant,
            disabled,
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);

CardHeader.displayName = "Card.Header";
