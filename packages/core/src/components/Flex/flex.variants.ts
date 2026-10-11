import { cva } from "class-variance-authority";

export const flexVariants = cva("flex", {
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
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      7: "gap-7",
      8: "gap-8",
      9: "gap-9",
    },
    display: {
      flex: "flex",
      "inline-flex": "inline-flex",
    },
  },
  defaultVariants: {
    direction: "row",
    wrap: "nowrap",
    justify: "start",
    align: "stretch",
    gap: 3,
    display: "flex",
  },
});
