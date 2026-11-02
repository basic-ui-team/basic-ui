import { createContext } from "react";
import { AllowedCardElements, CardProps, CardRootProps, CardVariant } from "./card.types";
import { Box } from "../Box";
import {
  cn,
  forwardRefWithAs,
  PolymorphicRef,
} from "@basic-ui/react-utilities";
import { cardRootVariants } from "./card.variants";

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
    onKeyDown,
    tabIndex,
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

  const cardClassName = cn(
    cardRootVariants({
      variant,
      isLink: !!href,
      interaction,
      selected,
      disabled,
    }),
    className,
  );

  const isDraggable = interaction === "draggable" || interaction === "both";
  const isClickable = !!href || interaction === "clickable" || interaction === "both";
  const isNativeInteractive = resolvedAs === "button" || (resolvedAs === "a" && !!href);
  const consumerKeyDown: React.KeyboardEventHandler<HTMLElement> | undefined = onKeyDown;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    consumerKeyDown?.(event);
    if (
      !event.defaultPrevented &&
      !disabled &&
      isClickable &&
      !isNativeInteractive &&
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const anchorProps = href && !disabled
    ? ({ href } as Record<string, unknown>)
    : ({} as Record<string, unknown>);

  return (
    <CardContext.Provider
      value={{
        variant: variant || "default",
        disabled: disabled || false,
        selected: selected || false,
        isLink: !!href,
      }}
    >
      <Box
        ref={ref}
        as={resolvedAs as AllowedCardElements}
        {...anchorProps}
        {...(resolvedAs === "button" ? { disabled } : {})}
        className={cardClassName}
        role={!isNativeInteractive && isClickable ? "button" : undefined}
        aria-label={ariaLabel}
        draggable={isDraggable && !disabled}
        onKeyDown={handleKeyDown}
        onClick={isClickable && !disabled ? onClick : undefined}
        onDragStart={isDraggable && !disabled ? onDragStart : undefined}
        onDragEnd={isDraggable && !disabled ? onDragEnd : undefined}
        onDragOver={isDraggable && !disabled ? onDragOver : undefined}
        onDrop={isDraggable && !disabled ? onDrop : undefined}
        aria-disabled={disabled || undefined}
        data-selected={selected || undefined}
        tabIndex={isClickable ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
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
