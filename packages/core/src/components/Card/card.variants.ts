import { cva } from "class-variance-authority";

export const cardRootVariants = cva(
  [
    "transition-all duration-normal ease-spring",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-surface border border-border-base rounded-lg shadow-s2 hover:shadow-s3 active:shadow-s1",
        elevated:
          "bg-surface border border-border-base rounded-lg shadow-s2 shadow-s2 hover:shadow-s4 active:shadow-s3",
        outlined:
          "bg-surface border border-border-base rounded-lg shadow-s2 border border-border-base hover:shadow-s1 active:shadow-s0", // duplication so we don't set a base styling.
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
        true: "border-primary-500 shadow-s3",
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
      true: "sticky bottom-0 z-dropdown bg-surface/95 backdrop-blur-sm",
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
