import { cva } from "class-variance-authority";

export const imageVariants = cva("inline-block overflow-hidden", {
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
