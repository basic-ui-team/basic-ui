import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../../../packages/core/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-themes"],
  framework: "@storybook/react-vite",
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@core": path.resolve(__dirname, "../../../packages/core/src"),
      "@basic-ui/tokens": path.resolve(__dirname, "../../../packages/tokens/src"),
      "@basic-ui/icons": path.resolve(__dirname, "../../../packages/icons/src"),
    };
    return config;
  },
};

export default config;
