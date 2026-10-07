import { cva } from "class-variance-authority";

export const dialogOverlayVariants = cva("fixed inset-0 flex items-center justify-center p-md");

export const dialogBackdropVariants = cva("fixed inset-0 bg-black/50");

export const dialogVariants = cva(
  [
    "bg-surface-base rounded-lg shadow-s4",
    "max-w-[42rem] mx-auto",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "",
      },
      modal: {
        true: "z-100",
        false: "",
      },
    },
    defaultVariants: {
      fullWidth: false,
      modal: true,
    },
  },
);

export const dialogHeaderVariants = cva("flex items-center justify-between gap-md", {
  variants: {
    hasTitle: {
      true: "p-md pb-0",
      false: "justify-end p-0",
    },
  },
  defaultVariants: {
    hasTitle: true,
  },
});

export const dialogTitleVariants = cva(
  "font-sans font-semibold leading-tight text-fg-base text-lg",
);

export const dialogBodyVariants = cva("flex flex-col gap-sm p-md");

export const dialogDescriptionVariants = cva("font-normal leading-snug text-fg-muted text-sm");

export const dialogFooterVariants = cva("flex items-center justify-end gap-sm p-md pt-0");

export const dialogCloseVariants = cva(
  [
    "shrink-0 p-sm rounded-sm text-fg-muted hover:text-fg-base hover:bg-black/5",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  ].join(" "),
);
