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
    // Opt into @basic-ui/core's local "dev" condition without replacing Vite's
    // default conditions, so package imports resolve to source during development.
    const defaultConditions = config.resolve.conditions ?? [
      "module",
      "browser",
      "development|production",
    ];
    config.resolve.conditions = [...defaultConditions, "dev"];
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@basic-ui/tokens": path.resolve(__dirname, "../../../packages/tokens/src"),
      "@basic-ui/icons": path.resolve(__dirname, "../../../packages/icons/src"),
      "@basic-ui/react-utilities": path.resolve(__dirname, "../../../packages/react-utilities/src"),
    };
    return config;
  },
};

export default config;
