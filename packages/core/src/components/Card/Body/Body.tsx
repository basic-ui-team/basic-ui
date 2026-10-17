import { Box } from "../../Box";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import { forwardRef, useContext } from "react";
import { CardContext } from "../Card";
import { CardBodyProps } from "../card.types";
import { cardSectionVariants, cardSectionSpacingClasses } from "../card.variants";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ variant = "default", className, ...rest }, ref) => {
    const ctx = useContext(CardContext);

    const disabled = ctx?.disabled || false;

    return (
      <Box
        as="div"
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

CardBody.displayName = "Card.Body";
