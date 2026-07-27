import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx|mdx)"],
  // addon-essentials was removed in Storybook 9+ (docs/controls/actions/
  // viewport/etc. are now built into core) — only a11y is still separate.
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
