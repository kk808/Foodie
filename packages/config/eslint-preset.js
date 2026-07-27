/** Shared ESLint (flat config) consumed by every app/package in the monorepo. */
const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "**/src/generated/**",
      // Tooling config files — plain CommonJS by convention, not app source.
      "**/eslint.config.js",
      "**/.eslintrc.cjs",
      "**/.eslintrc.json",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "**/style-dictionary.config.js",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
