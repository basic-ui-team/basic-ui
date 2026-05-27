import { cva } from "class-variance-authority";

export const boxVariants = cva("", {
  variants: {
    display: {
      block: "block",
      inline: "inline",
      "inline-block": "inline-block",
      none: "hidden",
    },
  },
  defaultVariants: {
    display: "block",
  },
});
