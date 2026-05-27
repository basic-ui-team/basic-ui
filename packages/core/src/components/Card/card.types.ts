import { ResponsiveValue } from "@core/hooks";
import { BoxProps } from "../Box";
import { HeaderProps, AllowedHeaderElements } from "../Header";
import { AllowedTextElements, TextProps } from "../Text";
import { PropsWithAs } from "@core/types/props";

export type AllowedCardElements = "div" | "button" | "a";
export type CardVariant = "default" | "elevated" | "outlined";
type CardInteraction = "static" | "clickable" | "draggable" | "both";

/**
 * Props for the main Card container.
 * Extends BoxProps to inherit spacing, sizing, and layout capabilities.
 */
export interface CardRootProps extends BoxProps<AllowedCardElements> {
  /**
   * Visual style variant.
   * @default "default"
   */
  variant?: ResponsiveValue<CardVariant>;

  /**
   * Determines the interaction behavior.
   * If 'clickable' or 'both', the component renders as a <button> (or <a> if href is provided).
   * If 'draggable' or 'both', the component becomes draggable.
   * @default "static"
   */
  interaction?: CardInteraction;

  /**
   * Optional href. If provided, the card renders as an <a> tag instead of a button.
   * Implies `interaction="clickable"`.
   */
  href?: string;

  /**
   * Whether the card is selected. Applies a selected style and sets aria-pressed for accessibility.
   * @default false
   */
  selected?: boolean;

  /**
   * Whether the card is disabled. Applies a disabled style and prevents interaction.
   * @default false
   */
  disabled?: boolean;

  /**
   *    Event handler for click events. Only applicable if `interaction` is "clickable" or "both".
   * If `href` is provided, the card will render as an anchor tag and this handler will be called on click events.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Event handler for drag start events. Only applicable if `interaction` is "draggable" or "both".
   */
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * Event handler for drag end events. Only applicable if `interaction` is "draggable" or "both".
   */
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * Event handler for drag over events. Only applicable if `interaction` is "draggable" or "both".
   */
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * Event handler for drop events. Only applicable if `interaction` is "draggable" or "both".
   */
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * Optional aria-label for accessibility when the card is interactive.
   */
  ariaLabel?: string;
}

export type CardProps<As extends AllowedCardElements = "div"> = PropsWithAs<CardRootProps, As>;

/**
 * Props for the CardHeader component, which is a subcomponent of Card.
 * Extends BoxProps to allow for spacing and layout control.
 */
export interface CardHeaderProps extends BoxProps {
  variant?: ResponsiveValue<"default" | "compact">;
}

/**
 * Props for the CardBody component, which is a subcomponent of Card.
 * Extends BoxProps to allow for spacing and layout control.
 */
export interface CardBodyProps extends BoxProps {
  variant?: ResponsiveValue<"default" | "compact">;
}

/**
 * Props for the CardFooter component, which is a subcomponent of Card.
 * Extends BoxProps to allow for spacing and layout control.
 */
export interface CardFooterProps extends BoxProps {
  variant?: ResponsiveValue<"default" | "compact">;
  sticky?: boolean;
}

/**
 * Props for the CardTitle component, which is a subcomponent of Card.
 * Extends HeaderProps to allow for header styling and formatting.
 */
export type CardTitleProps<As extends AllowedHeaderElements = "h3"> = HeaderProps<As>; // type instead of interface to allow for generic extension of HeaderProps with the 'as' prop

/**
 * Props for the CardDescription component, which is a subcomponent of Card.
 * Extends TextProps to allow for text styling and formatting.
 */
export type CardDescriptionProps<As extends AllowedTextElements = "p"> = TextProps<As>; // type instead of interface to allow for generic extension of TextProps with the 'as' prop

/**
 * Props for the CardImage component, which is a subcomponent of Card.
 * Extends BoxProps to allow for spacing and layout control.
 */
export interface CardImageProps extends BoxProps {
  src: string;
  alt: string;
  objectFit: "cover" | "contain" | "fill" | "none";
}

/**
 * Props for the unstyled version of the Card component.
 * This allows users to use the Card's functionality without any default styles, giving them full control over the appearance.
 */
export interface CardUnstyledProps extends Omit<CardRootProps, "variant"> {}

export interface CardComponent extends React.FC<CardRootProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Title: React.FC<CardTitleProps<"h3">>;
  Description: React.FC<CardDescriptionProps<"p">>;
  Image: React.FC<CardImageProps>;
  Unstyled: React.FC<CardUnstyledProps>;
}
