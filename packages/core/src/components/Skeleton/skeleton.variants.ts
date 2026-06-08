import { cva } from "class-variance-authority";

export const skeletonVariants = cva("bg-fg-skeleton", {
  variants: {
    variant: {
      text: "h-4 rounded-sm",
      rectangular: "h-12 rounded-md",
      circular: "h-10 w-10 rounded-full",
    },
    animated: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    variant: "text",
    animated: false,
  },
});
