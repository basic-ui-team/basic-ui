import { AllowedCardElements, CardUnstyledProps } from "../card.types";
import { Box } from "@core/components";
import { cn } from "@core/lib";
import { PolymorphicRef } from "@core/types/props";
import { CardContext } from "../Card";
import { cardRootVariants } from "../card.variants";
import { forwardRef } from "react";

export const _Card = <As extends AllowedCardElements = "div">(
  {
    as,
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
  }: CardUnstyledProps,
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

  const cardClassName = cn(
    cardRootVariants({
      variant: "unstyled",
      isLink: !!href,
      interaction,
      selected: selected || false,
      disabled: disabled || false,
    }),
    className,
  );

  const isDraggable = interaction === "draggable" || interaction === "both";
  const isClickable = interaction === "clickable" || interaction === "both";
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.(event as any);
    }
  };

  const anchorProps = href
    ? ({ href } as Record<string, unknown>)
    : ({} as Record<string, unknown>);

  return (
    <CardContext.Provider
      value={{
        variant: "unstyled",
        disabled: disabled || false,
        selected: selected || false,
        isLink: !!href,
      }}
    >
      <Box
        ref={ref}
        as={resolvedAs as AllowedCardElements}
        {...(anchorProps as any)}
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

export const CardUnstyled = forwardRef(_Card) as <Element extends AllowedCardElements = "div">(
  props: CardUnstyledProps & { as?: Element; ref?: PolymorphicRef<Element> },
) => React.ReactElement;

(CardUnstyled as any).displayName = "CardUnstyled";
