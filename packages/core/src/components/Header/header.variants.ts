import { cva } from "class-variance-authority";

export const headerVariants = cva("font-sans font-normal leading-tight", {
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
      default: "text-foreground-primary",
      primary: "text-primary-700 dark:text-primary-300",
      secondary: "text-secondary-700 dark:text-secondary-300",
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
    size: "h2",
    weight: "normal",
    color: "default",
    align: "left",
    truncate: false,
    wrap: "nowrap",
  },
});
