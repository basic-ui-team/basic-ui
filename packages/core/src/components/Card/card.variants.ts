import { cva } from "class-variance-authority";

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
    variant: {
      default: "p-md",
      compact: "p-sm",
    },
    sticky: {
      true: "sticky bottom-0 z-dropdown bg-surface-base/5 backdrop-blur-xs",
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

// Visual parity with Header defaults (headerVariants), owned by Card per the
// composition rule — only Box may be imported by other components.
export const cardTitleVariants = cva("font-sans font-normal leading-tight", {
  variants: {
    size: {
      h1: "text-3xl md:text-4xl lg:text-5xl",
      h2: "text-2xl md:text-3xl lg:text-4xl",
      h3: "text-xl md:text-2xl lg:text-3xl",
      h4: "text-lg md:text-xl lg:text-2xl",
      h5: "text-base md:text-lg lg:text-xl",
      h6: "text-sm md:text-base lg:text-lg",
    },
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
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "text-ellipsis",
      false: "",
    },
    wrap: {
      nowrap: "text-nowrap",
      wrap: "text-wrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
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

// Visual parity with Text defaults (textVariants), owned by Card per the
// composition rule. Defaults match Text defaults (size md, color default).
export const cardDescriptionVariants = cva("font-sans", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
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
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
    wrap: {
      nowrap: "text-nowrap",
      wrap: "text-wrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
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

// Visual parity with Image defaults (imageVariants), owned by Card per the
// composition rule.
export const cardImageFitVariants = cva("inline-block overflow-hidden", {
  variants: {
    objectFit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
      "scale-down": "object-scale-down",
    },
    aspectRatio: {
      square: "aspect-square",
      video: "aspect-video",
      landscape: "aspect-[4/3]",
      portrait: "aspect-[3/4]",
      auto: "",
    },
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
