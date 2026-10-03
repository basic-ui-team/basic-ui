import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes, removing conflicts automatically.
 * Combines clsx (conditional classes) + twMerge (smart class merging).
 *
 * @example
 * cn("px-4 py-2", "px-6") // "px-6 py-2"
 * cn("bg-blue-500", isActive && "bg-blue-700") // "bg-blue-700"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
