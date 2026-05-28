import { createContext } from "react";
import { AllowedCardElements, CardProps, CardRootProps, CardVariant } from "./card.types";
import { Box } from "../Box";
import { cn, forwardRefWithAs } from "@core/lib";
import { cardRootVariants } from "./card.variants";
import { useResponsiveProps } from "@core/hooks";
import { PolymorphicRef } from "@core/types/props";

type CardContextValue = {
  variant: CardVariant;
  disabled: boolean;
  selected: boolean;
  isLink: boolean;
} | null;

export const CardContext = createContext<CardContextValue>(null);

export const _Card = <As extends AllowedCardElements = "div">(
  {
    as,
    variant,
    interaction,
    href,
    selected,
    disabled,
    onClick,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    ariaLabel,
    className,
    style,
    children,
    ...rest
  }: CardProps<As>,
  ref: PolymorphicRef<As>,
) => {
  let resolvedAs;
  if (href) {
    resolvedAs = "a";
  } else if (interaction === "clickable") {
    resolvedAs = "button";
  } else {
    resolvedAs = as || "div";
  }

  const resolvedProps = useResponsiveProps({
    variant,
  });

  const cardClassName = cn(
    cardRootVariants({
      variant: resolvedProps.variant,
      isLink: !!href,
      interaction,
      selected,
      disabled,
    }),
    className,
  );

  const isDraggable = interaction === "draggable" || interaction === "both";
  const isClickable = !!href || interaction === "clickable" || interaction === "both";
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
    }
  };

  const anchorProps = href
    ? ({ href } as Record<string, unknown>)
    : ({} as Record<string, unknown>);

  return (
    <CardContext.Provider
      value={{
        variant: resolvedProps.variant || "default",
        disabled: disabled || false,
        selected: selected || false,
        isLink: !!href,
      }}
    >
      <Box
        ref={ref}
        as={resolvedAs as AllowedCardElements}
        {...anchorProps}
        className={cardClassName}
        role={resolvedAs !== "a" && resolvedAs !== "button" && isClickable ? "button" : undefined}
        aria-label={ariaLabel}
        draggable={isDraggable && !disabled}
        onKeyDown={onKeyDown}
        onClick={isClickable && !disabled ? onClick : undefined}
        onDragStart={isDraggable && !disabled ? onDragStart : undefined}
        onDragEnd={isDraggable && !disabled ? onDragEnd : undefined}
        onDragOver={isDraggable && !disabled ? onDragOver : undefined}
        onDrop={isDraggable && !disabled ? onDrop : undefined}
        aria-disabled={disabled || undefined}
        data-selected={selected || undefined}
        tabIndex={isClickable && !disabled ? 0 : undefined}
        style={style}
        {...rest}
      >
        {children}
      </Box>
    </CardContext.Provider>
  );
};

export const Card = forwardRefWithAs<CardRootProps, AllowedCardElements>(_Card);

(Card as unknown as { displayName?: string }).displayName = "Card.Root";
