import { Card as CardRoot } from "./Card";
import type { CardComponent } from "./card.types";
import { CardHeader } from "./Header/Header";
import { CardFooter } from "./Footer/Footer";
import { CardBody } from "./Body/Body";
import { CardTitle } from "./Title/Title";
import { CardDescription } from "./Description/Description";
import { CardImage } from "./Image/Image";
import { CardUnstyled } from "./Unstyled/Unstyled";

export const CardModule = Object.assign(CardRoot, {
  Header: CardHeader,
  Footer: CardFooter,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Image: CardImage,
  Unstyled: CardUnstyled,
});

export const Card: CardComponent = CardModule as CardComponent;

(Card as unknown as { displayName?: string }).displayName = "Card";
