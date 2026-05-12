import { useEffect, useState } from "react";

/**
 * Hook that tracks whether a media query matches the current viewport.
 * @param query - CSS media query string (e.g., `"(max-width: 768px)"`, `"(prefers-color-scheme: dark)"`).
 * @returns `true` if query matches, `false` otherwise. Updates reactively as viewport changes.
 * @example
 * ```tsx
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const isDark = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      // If window or matchMedia is not available (e.g., during server-side rendering), return false
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      // If window or matchMedia is not available, do nothing
      return;
    }
    const mediaQueryList = window.matchMedia(query);

    // Define a handler to update the matches state when the media query match status changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQueryList.addEventListener("change", handler);

    // Cleanup function to remove the event listener when the component unmounts or the query changes
    return () => {
      mediaQueryList.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
