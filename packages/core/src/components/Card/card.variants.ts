import { cva } from "class-variance-authority";
import { textWrapClasses } from "@core/lib";

export const cardSectionSpacingClasses = {
  default: "p-3",
  compact: "p-2",
} as const;

export const cardTitleSizeClasses = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  h5: "text-md",
  h6: "text-sm",
} as const;

export const cardDescriptionSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
} as const;

export const cardTextAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const cardImageObjectFitClasses = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
} as const;

export const cardImageAspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  auto: "aspect-auto",
} as const;

export const cardRootVariants = cva(
  [
    "transition-all duration-normal ease-spring",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-surface-base rounded-lg shadow-s2 hover:shadow-s3 active:shadow-s1",
        elevated: "bg-surface-base rounded-lg shadow-s4 hover:shadow-s5 active:shadow-s3",
        outlined:
          "bg-surface-base border border-border-base rounded-lg shadow-s2 hover:shadow-s3 active:shadow-s1", // duplication so we don't set a base styling.
        unstyled: "",
      },
      isLink: {
        true: "no-underline text-inherit decoration-transparent",
        false: "",
      },
      interaction: {
        static: "",
        clickable: "cursor-pointer",
        draggable: "cursor-move",
        both: "cursor-move",
      },
      selected: {
        true: "border border-2 border-border-success",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isLink: false,
      interaction: "static",
      selected: false,
      disabled: false,
    },
  },
);

export const cardSectionVariants = cva("", {
  variants: {
    variant: cardSectionSpacingClasses,
    sticky: {
      true: "sticky bottom-0 z-sticky bg-surface-base/5 backdrop-blur-xs",
      false: "",
    },
    disabled: {
      true: "opacity-50 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    sticky: false,
    disabled: false,
  },
});

export const cardImageVariants = cva("", {
  variants: {
    disabled: {
      true: "opacity-50 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const cardTitleVariants = cva("font-sans font-normal leading-tight", {
  variants: {
    size: cardTitleSizeClasses,
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-fg-base",
      primary: "text-primary-700 dark:text-primary-300",
      secondary: "text-secondary-700 dark:text-secondary-300",
      muted: "text-fg-muted",
      error: "text-fg-error",
      success: "text-fg-success",
      warning: "text-fg-warning",
      info: "text-fg-info",
      custom: "",
    },
    align: cardTextAlignClasses,
    truncate: {
      true: "truncate",
      false: "",
    },
    wrap: textWrapClasses,
  },
  defaultVariants: {
    size: "h3",
    weight: "normal",
    color: "default",
    align: "left",
    truncate: false,
    wrap: "nowrap",
  },
});

export const cardDescriptionVariants = cva("font-sans", {
  variants: {
    size: cardDescriptionSizeClasses,
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-fg-base",
      muted: "text-fg-muted",
      primary: "text-primary-700 dark:text-primary-300",
      secondary: "text-secondary-700 dark:text-secondary-300",
      error: "text-fg-error",
      success: "text-fg-success",
      warning: "text-fg-warning",
      info: "text-fg-info",
      custom: "",
    },
    align: cardTextAlignClasses,
    truncate: {
      true: "truncate",
      false: "",
    },
    wrap: textWrapClasses,
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    color: "default",
    align: "left",
    truncate: false,
    wrap: "wrap",
  },
});

export const cardImageFitVariants = cva("inline-block overflow-hidden", {
  variants: {
    objectFit: cardImageObjectFitClasses,
    aspectRatio: cardImageAspectRatioClasses,
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    objectFit: "cover",
    aspectRatio: "auto",
    rounded: "none",
  },
});
