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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
    "[&_[data-slot=thumb]]:block [&_[data-slot=thumb]]:rounded-full [&_[data-slot=thumb]]:shadow-sm [&_[data-slot=thumb]]:transition-transform [&_[data-slot=thumb]]:duration-fast",
  ].join(" "),
  {
    variants: {
      color: {
        primary: "",
        secondary: "",
        error: "",
        success: "",
        warning: "",
        info: "",
      },
      checked: {
        true: "",
        false: "bg-bg-muted hover:bg-bg-active",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      // checked track colors per intent
      { color: "primary", checked: true, className: "bg-primary-600 hover:bg-primary-700" },
      { color: "secondary", checked: true, className: "bg-secondary-600 hover:bg-secondary-700" },
      { color: "error", checked: true, className: "bg-bg-error hover:bg-bg-error/85" },
      { color: "success", checked: true, className: "bg-bg-success hover:bg-bg-success/85" },
      { color: "warning", checked: true, className: "bg-bg-warning hover:bg-bg-warning/85" },
      { color: "info", checked: true, className: "bg-bg-info hover:bg-bg-info/85" },
      // thumb color: inverted on the muted off-track, white on colored on-tracks
      { checked: false, className: "[&_[data-slot=thumb]]:bg-fg-inverted" },
      { checked: true, color: "primary", className: "[&_[data-slot=thumb]]:bg-white" },
      { checked: true, color: "secondary", className: "[&_[data-slot=thumb]]:bg-white" },
      { checked: true, color: "error", className: "[&_[data-slot=thumb]]:bg-white" },
      { checked: true, color: "success", className: "[&_[data-slot=thumb]]:bg-white" },
      { checked: true, color: "warning", className: "[&_[data-slot=thumb]]:bg-white" },
      { checked: true, color: "info", className: "[&_[data-slot=thumb]]:bg-white" },
    ],
    defaultVariants: {
      color: "primary",
      checked: false,
      disabled: false,
    },
  },
);
