import { cva } from "class-variance-authority";

// Button style variants mapped against the built-in semantic colors.
// Each compound variant provides the composite classes for variant+color across states.
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-sm font-medium select-none",
    "transition-all duration-slow ease-spring",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
    "text-fg-base disabled:text-fg-muted",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-sm py-xs text-sm gap-xs rounded-md",
        md: "px-md py-sm text-md gap-sm rounded-lg",
        lg: "px-lg py-md text-lg gap-md rounded-xl",
      },
      variant: {
        solid: "",
        surface: "",
        ghost: "",
        outline: "",
        link: "cursor-pointer",
      },
      color: {
        default: "",
        muted: "",
        primary: "",
        secondary: "",
        error: "",
        success: "",
        warning: "",
        info: "",
      },
      loading: {
        true: "opacity-80 cursor-progress pointer-events-none",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      // --- solid ---
      { variant: "solid", color: "default", className: "bg-bg-inverted text-fg-inverted hover:bg-bg-inverted/85 active:bg-bg-inverted/70" },
      { variant: "solid", color: "muted", className: "bg-bg-muted text-fg-muted hover:bg-bg-hover active:bg-bg-active" },
      { variant: "solid", color: "primary", className: "bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-700" },
      { variant: "solid", color: "secondary", className: "bg-secondary-700 text-white hover:bg-secondary-600 active:bg-secondary-700" },
      { variant: "solid", color: "error", className: "bg-bg-error text-fg-base hover:bg-bg-error/85 active:bg-bg-error/70" },
      { variant: "solid", color: "success", className: "bg-bg-success text-fg-base hover:bg-bg-success/85 active:bg-bg-success/70" },
      { variant: "solid", color: "warning", className: "bg-bg-warning text-fg-base hover:bg-bg-warning/85 active:bg-bg-warning/70" },
      { variant: "solid", color: "info", className: "bg-bg-info text-fg-base hover:bg-bg-info/85 active:bg-bg-info/70" },

      // --- ghost (transparent, interaction highlights) ---
      { variant: "ghost", color: "default", className: "bg-transparent text-fg-base hover:bg-bg-hover active:bg-bg-active" },
      { variant: "ghost", color: "muted", className: "bg-transparent text-fg-muted hover:bg-bg-hover active:bg-bg-active" },
      { variant: "ghost", color: "primary", className: "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100" },
      { variant: "ghost", color: "secondary", className: "bg-transparent text-secondary-500 hover:bg-secondary-50 active:bg-secondary-100" },
      { variant: "ghost", color: "error", className: "bg-transparent text-fg-error hover:bg-bg-error active:bg-surface-error" },
      { variant: "ghost", color: "success", className: "bg-transparent text-fg-success hover:bg-bg-success active:bg-surface-success" },
      { variant: "ghost", color: "warning", className: "bg-transparent text-fg-warning hover:bg-bg-warning active:bg-surface-warning" },
      { variant: "ghost", color: "info", className: "bg-transparent text-fg-info hover:bg-bg-info active:bg-surface-info" },

      // --- outline (bordered) ---
      { variant: "outline", color: "default", className: "bg-transparent text-fg-base border border-border-base hover:bg-bg-hover active:bg-bg-active" },
      { variant: "outline", color: "muted", className: "bg-transparent text-fg-muted border border-border-muted hover:bg-bg-hover active:bg-bg-active" },
      { variant: "outline", color: "primary", className: "bg-transparent text-primary-600 border border-primary-500 hover:bg-primary-50 active:bg-primary-100" },
      { variant: "outline", color: "secondary", className: "bg-transparent text-secondary-500 border border-secondary-500 hover:bg-secondary-50 active:bg-secondary-100" },
      { variant: "outline", color: "error", className: "bg-transparent text-fg-error border border-border-error hover:bg-bg-error active:bg-surface-error" },
      { variant: "outline", color: "success", className: "bg-transparent text-fg-success border border-border-success hover:bg-bg-success active:bg-surface-success" },
      { variant: "outline", color: "warning", className: "bg-transparent text-fg-warning border border-border-warning hover:bg-bg-warning active:bg-surface-warning" },
      { variant: "outline", color: "info", className: "bg-transparent text-fg-info border border-border-info hover:bg-bg-info active:bg-surface-info" },

      // --- link (text-only) ---
      { variant: "link", color: "default", className: "bg-transparent text-fg-base underline hover:text-fg-active active:no-underline" },
      { variant: "link", color: "muted", className: "bg-transparent text-fg-muted underline hover:text-fg-base active:no-underline" },
      { variant: "link", color: "primary", className: "bg-transparent text-primary-600 underline hover:text-primary-700 active:no-underline" },
      { variant: "link", color: "secondary", className: "bg-transparent text-secondary-500 underline hover:text-secondary-600 active:no-underline" },
      { variant: "link", color: "error", className: "bg-transparent text-fg-error underline hover:text-fg-error active:no-underline" },
      { variant: "link", color: "success", className: "bg-transparent text-fg-success underline hover:text-fg-success active:no-underline" },
      { variant: "link", color: "warning", className: "bg-transparent text-fg-warning underline hover:text-fg-warning active:no-underline" },
      { variant: "link", color: "info", className: "bg-transparent text-fg-info underline hover:text-fg-info active:no-underline" },
    ],
    defaultVariants: {
      size: "md",
      variant: "solid",
      color: "default",
      loading: false,
      disabled: false,
    },
  },
);

// Only needed if the icon passed in is not an Icon component (which applies its own size classes based on the button size).
export const buttonIconVariants = cva("flex-shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default buttonVariants;
