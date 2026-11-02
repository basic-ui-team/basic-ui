import { cva } from "class-variance-authority";

export const buttonSizeClasses = {
  sm: "px-2 py-1 text-sm gap-1 rounded-md",
  md: "px-4 py-2 text-md gap-2 rounded-lg",
  lg: "px-6 py-3 text-lg gap-3 rounded-xl",
} as const;

export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 font-medium select-none",
    "transition-colors duration-normal ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  ].join(" "),
  {
    variants: {
      size: buttonSizeClasses,
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
        outline:
          "border border-input bg-background text-foreground hover:bg-muted-hover active:bg-muted-active",
        ghost: "text-foreground hover:bg-muted-hover active:bg-muted-active",
        link: "cursor-pointer text-primary underline-offset-4 hover:underline",
      },
      loading: {
        true: "opacity-65 cursor-progress",
        false: "",
      },
      disabled: {
        true: "opacity-65 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      loading: false,
      disabled: false,
    },
  },
);
