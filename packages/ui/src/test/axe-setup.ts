import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// `jest-axe` ships a Jest-flavored matcher; vitest's `expect` is
// jest-API-compatible, so `expect.extend` picks it up the same way.
expect.extend(toHaveNoViolations);
