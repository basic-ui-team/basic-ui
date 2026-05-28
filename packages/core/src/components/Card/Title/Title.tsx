import { AllowedHeaderElements, Header } from "@core/components/Header";
import { CardTitleProps } from "../card.types";
import { PolymorphicRef } from "@core/types/props";
import { forwardRef } from "react";

const _Title = <as extends AllowedHeaderElements = "h3">(
  { as, className, ...rest }: CardTitleProps<as>,
  ref: PolymorphicRef<as>,
) => {
  const Component = as || "h3";

  return (
    <Header as={Component as AllowedHeaderElements} className={className} ref={ref} {...rest} />
  );
};

export const CardTitle = forwardRef(_Title) as <Element extends AllowedHeaderElements = "h3">(
  props: CardTitleProps<Element> & { ref?: PolymorphicRef<Element> },
) => React.ReactElement;

(CardTitle as unknown as { displayName?: string }).displayName = "CardTitle";