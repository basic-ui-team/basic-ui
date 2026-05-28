import { Box } from "@core/components/Box";
import { useResponsiveProps } from "@core/hooks";
import { cn } from "@core/lib";
import { forwardRef, useContext } from "react";
import { CardContext } from "../Card";
import { CardBodyProps } from "../card.types";
import { cardSectionVariants } from "../card.variants";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ variant = "default", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const resolvedProps = useResponsiveProps({
      variant,
    });
    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="div"
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

CardBody.displayName = "Card.Body";
