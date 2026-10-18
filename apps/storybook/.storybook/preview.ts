import type { Preview } from "@storybook/react";
import type { Viewport } from "storybook/viewport";
import { withThemeByClassName } from "@storybook/addon-themes";
// ignore the fact that this import is not used directly, it's needed to initialize the themes
import "./index.css";

// Viewport options aligned with the token breakpoints (640/768/1024/1280/1536)
// so responsive props can be exercised from the toolbar.
const breakpointViewports: Record<string, Viewport> = {
  mobile: {
    name: "Mobile",
    styles: { width: "375px", height: "667px" },
    type: "mobile",
  },
  sm: { name: "sm - 640px", styles: { width: "640px", height: "1024px" }, type: "mobile" },
  md: { name: "md - 768px", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  lg: { name: "lg - 1024px", styles: { width: "1024px", height: "768px" }, type: "desktop" },
  xl: { name: "xl - 1280px", styles: { width: "1280px", height: "800px" }, type: "desktop" },
  "2xl": { name: "2xl - 1536px", styles: { width: "1536px", height: "960px" }, type: "desktop" },
};

const preview: Preview = {
  decorators: [
    // Registers the light/dark toolbar and applies the class to <html>.
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      parentSelector: "html",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    viewport: {
      options: breakpointViewports,
    },
  },
};

export default preview;
