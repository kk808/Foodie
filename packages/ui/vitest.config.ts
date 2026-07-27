import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // React Testing Library's automatic per-test DOM cleanup only kicks in
    // when it detects a global `afterEach` — needs `globals: true` here.
    globals: true,
  },
});
