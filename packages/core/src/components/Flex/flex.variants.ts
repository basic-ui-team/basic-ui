import { cva } from "class-variance-authority";

export const flexVariants = cva("transition-all duration-normal w-full", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      reverse: "flex-wrap-reverse",
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    },
    align: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      stretch: "items-stretch",
    },
    inline: {
      true: "inline-flex",
      false: "flex",
    },
  },
  defaultVariants: {
    direction: "row",
    wrap: "nowrap",
    justify: "start",
    align: "stretch",
    // layout-related defaults are handled by layoutVariants
  },
});
