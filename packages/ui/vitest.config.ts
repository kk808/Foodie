import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // React Testing Library's automatic per-test DOM cleanup only kicks in
    // when it detects a global `afterEach` — needs `globals: true` here.
    globals: true,
    // Registers `expect(...).toHaveNoViolations()` (Phase 7) for the axe
    // accessibility tests.
    setupFiles: ["./src/test/axe-setup.ts"],
  },
});
