import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

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
    // Opt into the workspace-only "dev" condition without replacing Vite's
    // default conditions, so package imports resolve to source during development.
    const defaultConditions = config.resolve.conditions ?? [
      "module",
      "browser",
      "development|production",
    ];
    config.resolve.conditions = [...defaultConditions, "dev"];
    return config;
  },
};

export default config;
