/** Shared ESLint config consumed by every app/package in the monorepo. */
module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    es2022: true,
    node: true,
  },
  ignorePatterns: ["dist/**", ".next/**", "node_modules/**"],
};
