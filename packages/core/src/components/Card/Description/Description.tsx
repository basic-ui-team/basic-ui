import { AllowedTextElements, Text } from "@core/components/Text";
import { CardDescriptionProps } from "../card.types";
import { PolymorphicRef } from "@core/types/props";
import { forwardRef } from "react";

const _Description = <As extends AllowedTextElements = "p">(
  { as, className, ...rest }: CardDescriptionProps<As>,
  ref: PolymorphicRef<As>,
) => {
  const Component = as || "p";

  return <Text as={Component as AllowedTextElements} className={className} ref={ref} {...rest} />;
};

export const CardDescription = forwardRef(_Description) as <
  Element extends AllowedTextElements = "p",
>(
  props: CardDescriptionProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement;

(CardDescription as any).displayName = "CardDescription";
