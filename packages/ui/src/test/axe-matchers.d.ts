import "vitest";

// `@types/jest-axe` augments Jest's `jest.Matchers`, but this workspace runs
// on vitest, whose `expect` has its own `Assertion` interface — it doesn't
// pick up Jest's ambient types even though `expect.extend` works fine at
// runtime (vitest's `expect` is Jest-API-compatible). Augment vitest's own
// interface so `toHaveNoViolations()` type-checks in `a11y.test.tsx`.
declare module "vitest" {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
}
