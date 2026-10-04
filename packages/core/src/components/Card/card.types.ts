import { ResponsiveValue } from "@basic-ui/react-utilities";
import { BoxProps } from "../Box";
import { CommonProps, PropsWithAs, RestrictedPropsWithAs } from "@basic-ui/react-utilities";
import type { LayoutProps } from "../../lib/layout";
import { BuiltInSemanticColors } from "@core/theme";
import type { ImgHTMLAttributes } from "react";

export type AllowedCardElements = "div" | "button" | "a";
export type CardVariant = "default" | "elevated" | "outlined" | "unstyled";
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
 * Allowed heading elements for CardTitle.
 */
export type AllowedHeaderElements = `h${1 | 2 | 3 | 4 | 5 | 6}`;

/**
 * Props for the CardTitle component, which is a subcomponent of Card.
 * Owns its heading styling fully via card.variants (no Header dependency).
 */
export interface CardTitleOwnProps extends CommonProps, LayoutProps {
  /** Heading level used for sizing. @default "h3" */
  size?: ResponsiveValue<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
  /** Font weight. @default "medium" */
  weight?: ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  /** Text color. @default "default" */
  color?: ResponsiveValue<BuiltInSemanticColors | string>;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Truncate the text. @default false */
  truncate?: ResponsiveValue<boolean>;
  /** Text wrapping behavior. @default "nowrap" */
  wrap?: ResponsiveValue<"wrap" | "nowrap" | "pretty" | "balance">;
}

export type CardTitleProps<As extends AllowedHeaderElements = "h3"> = RestrictedPropsWithAs<
  CardTitleOwnProps,
  As
>;

/**
 * Allowed elements for CardDescription.
 */
export type AllowedTextElements = "span" | "p" | "div";

/**
 * Props for the CardDescription component, which is a subcomponent of Card.
 * Owns its text styling fully via card.variants (no Text dependency).
 */
export interface CardDescriptionOwnProps extends CommonProps, LayoutProps {
  /** Size of the text. @default "sm" */
  size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl">;
  /** Font weight. @default "normal" */
  weight?: ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  /** Text color. @default "muted" */
  color?: ResponsiveValue<BuiltInSemanticColors | string>;
  /** Text alignment. @default "left" */
  align?: ResponsiveValue<"left" | "center" | "right">;
  /** Truncate text with ellipsis. @default false */
  truncate?: ResponsiveValue<boolean>;
  /** Text wrapping behavior. @default "wrap" */
  wrap?: ResponsiveValue<"nowrap" | "wrap" | "balance" | "pretty">;
}

export type CardDescriptionProps<As extends AllowedTextElements = "p"> = RestrictedPropsWithAs<
  CardDescriptionOwnProps,
  As
>;

export type ObjectFitType = "cover" | "contain" | "fill" | "none" | "scale-down";
export type AspectRatioType = "square" | "video" | "landscape" | "portrait" | "auto";

/**
 * Props for the CardImage component, which is a subcomponent of Card.
 * CardImage is always rendered as an <img> element and owns its styling
 * fully via card.variants (no Image dependency).
 */
export interface CardImageOwnProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height" | "src" | "alt">,
    CommonProps,
    LayoutProps {
  /** The source URL of the image. */
  src: string;
  /** Alt text for accessibility. */
  alt: string;
  /** How the image should scale to fit its container. @default "cover" */
  objectFit?: ResponsiveValue<ObjectFitType>;
  /** Aspect ratio preset. @default "auto" */
  aspectRatio?: ResponsiveValue<AspectRatioType>;
  /** Loading strategy. @default "lazy" */
  loading?: "lazy" | "eager";
  /** Decoding strategy. @default "auto" */
  decoding?: "async" | "sync" | "auto";
  rounded?: ResponsiveValue<"none" | "sm" | "md" | "lg" | "xl" | "full">;
}

export type CardImageProps = PropsWithAs<CardImageOwnProps, "img">;

/**
 * Props for the unstyled version of the Card component.
 * This allows users to use the Card's functionality without any default styles, giving them full control over the appearance.
 * It should be used in place of the main Card component not as a child of it, and supports all the same props except for the 'variant' which is fixed to 'unstyled' in the implementation.
 */
export interface CardUnstyledProps extends Omit<CardRootProps, "variant"> {}

export interface CardComponent extends React.FC<CardRootProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Title: React.FC<CardTitleProps<AllowedHeaderElements>>;
  Description: React.FC<CardDescriptionProps<AllowedTextElements>>;
  Image: React.FC<CardImageProps>;
  Unstyled: React.FC<CardUnstyledProps>;
}
