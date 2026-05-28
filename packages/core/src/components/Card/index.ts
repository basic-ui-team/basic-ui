import { Card as CardRoot } from "./Card";
import { CardHeader } from "./Header/Header";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
});

(Card as any).displayName = "Card";