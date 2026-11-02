import { cva } from "class-variance-authority";

export const toggleSizeClasses = {
  sm: "h-[16px] w-[32px] p-[2px]",
  md: "h-[20px] w-[36px] p-[2px]",
  lg: "h-[24px] w-[44px] p-[2px]",
};

export const toggleThumbGeometryVariants = cva("", {
  variants: {
    size: {
      sm: "h-[12px] w-[12px]",
      md: "h-[14px] w-[14px]",
      lg: "h-[16px] w-[16px]",
    },
    checked: {
      true: "",
      false: "translate-x-0",
    },
  },
  compoundVariants: [
    { size: "sm", checked: true, className: "translate-x-[16px]" },
    { size: "md", checked: true, className: "translate-x-[18px]" },
    { size: "lg", checked: true, className: "translate-x-[24px]" },
  ],
});

export const toggleVariants = cva(
  [
    "relative inline-flex items-center shrink-0 rounded-full",
    "transition-colors duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "[&_[data-slot=thumb]]:block [&_[data-slot=thumb]]:rounded-full [&_[data-slot=thumb]]:shadow-sm [&_[data-slot=thumb]]:transition-transform [&_[data-slot=thumb]]:duration-fast",
  ].join(" "),
  {
    variants: {
      checked: {
        true: "bg-primary hover:bg-primary-hover active:bg-primary-active",
        false: "bg-muted hover:bg-muted-hover active:bg-muted-active",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        checked: false,
        className: "[&_[data-slot=thumb]]:bg-background",
      },
      { checked: true, className: "[&_[data-slot=thumb]]:bg-primary-foreground" },
    ],
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);
