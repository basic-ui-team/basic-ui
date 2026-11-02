import { AllowedCardElements, CardUnstyledProps } from "../card.types";
import { forwardRefWithAs, PolymorphicRef } from "@basic-ui/react-utilities";
import { _Card as renderCard } from "../Card";

export const _Card = <As extends AllowedCardElements = "div">(
  props: CardUnstyledProps,
  ref: PolymorphicRef<As>,
) => renderCard({ ...props, variant: "unstyled" }, ref);

export const CardUnstyled = forwardRefWithAs<CardUnstyledProps, AllowedCardElements>(_Card);

(CardUnstyled as unknown as { displayName?: string }).displayName = "CardUnstyled";
