import type { Config } from "tailwindcss";
import base from "@foodie/config/tailwind.config";

const config: Config = {
  presets: [base as Config],
  content: [
    "./stories/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
