import type { Config } from "tailwindcss";
import { theme } from "@foodie/tokens/tailwind-theme";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
    },
  },
};

export default config;
