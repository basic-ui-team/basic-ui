import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  [
    "relative inline-flex items-center shrink-0 rounded-full",
    "transition-colors duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
    "[&_[data-slot=thumb]]:block [&_[data-slot=thumb]]:rounded-full [&_[data-slot=thumb]]:shadow-sm [&_[data-slot=thumb]]:transition-transform [&_[data-slot=thumb]]:duration-fast",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-4 w-8 p-0.5",
        md: "h-5 w-9 p-0.5",
        lg: "h-6 w-11 p-0.5",
      },
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
      // thumb sizes per size
      { size: "sm", className: "[&_[data-slot=thumb]]:h-3 [&_[data-slot=thumb]]:w-3" },
      { size: "md", className: "[&_[data-slot=thumb]]:h-3.5 [&_[data-slot=thumb]]:w-3.5" },
      { size: "lg", className: "[&_[data-slot=thumb]]:h-4 [&_[data-slot=thumb]]:w-4" },
      // thumb travel per size when checked
      { size: "sm", checked: true, className: "[&_[data-slot=thumb]]:translate-x-4" },
      { size: "md", checked: true, className: "[&_[data-slot=thumb]]:translate-x-3.5" },
      { size: "lg", checked: true, className: "[&_[data-slot=thumb]]:translate-x-5" },
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
      size: "md",
      color: "primary",
      checked: false,
      disabled: false,
    },
  },
);
