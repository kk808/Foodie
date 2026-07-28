# AI_CONTEXT.md

Durable notes on how to work in this repo — style, preferences, and gotchas
that hold across phases, not a changelog. For what's actually been built
and what's left, see `CLAUDE.md` (handoff/orientation) and `TODO.md` /
`DONE.md` (the detailed phase-by-phase record). This file is memory for
*how* to work here; those are the record of *what* has been done.

## Project philosophy

- **Design-system-first, Figma is the source of truth.** Nothing gets
  built from memory or a screenshot alone. Tokens come from Figma, then
  primitives are built from tokens, then composites from primitives, then
  screens from composites. Never invert this — don't hand-roll a one-off
  style in a screen that should have come from a token or component.
- **Pull from Figma before writing any component or screen code, every
  time**, even for a component that looks simple or "obviously" matches an
  existing pattern. `get_metadata` to find the node, `get_design_context`
  for exact structure/copy/colors, `get_screenshot` to sanity-check. This
  has caught real bugs repeatedly (missing primitives, wrong text colors on
  Yellow/Green buttons, wrong gap values) that guessing from a similar
  component would not have caught.
- **Reuse before inventing.** A gap in an existing component (wrong size,
  missing prop, missing state) is fixed with a new prop or variant on that
  component, not a parallel one-off. A missing color is filled by
  re-aliasing to an *already-approved* palette primitive if one fits,
  never by inventing a new hex value.
- **Verification means running things, not reading them.** "It typechecks"
  is not done. Every change gets a real install → build → typecheck → lint
  → test pass, and UI changes get an actual rendered check (`next dev` +
  fetch the HTML, or a Storybook screenshot) before being called finished.
- **Visual/brand decisions need a human; token-reuse fixes don't.** Fixing
  a WCAG contrast failure by re-pointing a semantic token to an existing,
  already-approved primitive is safe to do unilaterally. Changing an actual
  brand color (a button's fill, a new hex value) is not — flag it and wait.
- **Figma and code are two sources that must be deliberately kept in
  sync — never assumed to be.** When code diverges from Figma (e.g. an
  accessibility fix that changes a value Figma still has as the old one),
  say so explicitly rather than letting it go unnoticed. Only push a fix
  back into the live Figma file when asked — inspect first, make the
  smallest targeted change, verify after.
- **Accessibility is a first-class deliverable, not a lint afterthought.**
  Automated `axe` checks, real WCAG contrast math against token values (not
  guesses), and a manual pass over focus order/labels/keyboard reachability
  are all expected, not optional extras.

## Coding style

- **Every component and token gets a doc comment citing the Figma node
  ID(s) it was built from**, and explains *why* whenever it deviates from a
  literal Figma value (an arbitrary `rounded-[10px]`, a `gapPx` override,
  etc.). This is what makes a decision traceable months later — don't skip
  it to save time.
- **Tailwind classes reference design tokens, never raw values.**
  `bg-brand-primary` not `bg-[#43b1a8]`; `p-md` not `p-[12px]`. The only
  exception is a literal Figma value that genuinely has no matching token
  (document inline why, e.g. a 20px gap when the scale jumps 16→24).
- **CVA (`class-variance-authority`) for any component with color or size
  variants.** Plain prop-driven class arrays for everything simpler — don't
  reach for CVA on a component with one visual state.
- **Single-file components** — no separate CSS/style files, styling lives
  in the Tailwind classes on the component itself.
- **Explicit types on props, no implicit `any`.** Import React types
  explicitly (`import type { ChangeEvent } from "react"`) rather than
  using the `React.X` global-namespace form — that form silently works
  right up until lint catches it (see Common pitfalls).
- **Placement test for a new component:** would a second app plausibly want
  this as a generic primitive? If yes, it belongs in `@foodie/ui`. If it's
  about viewport framing, route structure, or one-off screen copy, it
  belongs at the app level. Don't default new things into the shared
  library just because it's convenient.
- **Presentational components stay dumb.** Flow-step-style components take
  only the props/callbacks they need and let a parent own state — don't
  reach into global state or routing from a leaf component.

## Preferred libraries / tooling

- **Turborepo + pnpm workspaces** for the monorepo; `workspace:*` internal
  deps, no publish/registry step until a second consumer actually needs one.
- **Next.js App Router** (not Pages Router) for the web app; Server
  Components by default, `"use client"` only when something genuinely needs
  interactivity (state, event handlers, browser APIs) — not blanket-applied.
- **Style Dictionary** for the token pipeline (Figma JSON → CSS vars / TS
  consts / Tailwind theme object). Don't hand-write generated token files.
- **Tailwind v3** (not v4) — v4's CSS-native `@theme` config would need
  reworking the whole token pipeline; not worth it without a real driver.
- **TypeScript on the latest stable major that the rest of the ecosystem
  (tsup, ts-eslint, Storybook docgen) actually supports** — don't jump to a
  brand-new major just because it's out.
- **Vitest + React Testing Library** for unit tests; **jest-axe** (via
  `expect.extend`, vitest's `expect` is Jest-API-compatible) for automated
  accessibility checks layered into the same suite — not a separate a11y
  tool with its own config to maintain.
- **Storybook** (current major, addons kept in lockstep versions — mixing
  a stale `addon-*` version against a newer core is a real source of
  mysterious warnings) for component documentation and interactive a11y
  checking (`@storybook/addon-a11y`).
- **Playwright + pixelmatch**, hand-rolled script, for visual regression —
  preferred over `@storybook/test-runner` here specifically because pinning
  a test-runner version against a fast-moving Storybook major wasn't worth
  the verification cost; a small script is easier to keep in sync.
- **Prefer a small hand-written script over a heavier framework** whenever
  the framework's main value-add is boilerplate reduction for a problem
  that's only a couple hundred lines anyway.

## Naming conventions

- **Design tokens are namespaced by category, lowercase, kebab/slash
  style**, matching Figma's own variable names one-to-one: `bg/canvas`,
  `bg/surface`, `text/primary`, `text/secondary`, `text/inverse`,
  `brand/primary` (+`-hover`), `accent/orange|pink|yellow|green`
  (+`-hover` for each), `border/subtle`, `rating/star`, `focus/ring`. Don't
  invent a new naming scheme for a new token — extend the existing
  category structure.
- **Primitive color names use the family + numeric shade Figma uses**
  (`charcoal-900`, `teal-500`, `teal-600`, etc.) — keep the *number* in
  code and Figma identical even where the family name itself might drift;
  a value under two different names in the two places is a bug waiting to
  bite (see Common pitfalls).
- **Components are named after what they are, not their location or
  variant** — `StarRating`, not `RatingStars` or `SmallStarRating` (size is
  a prop). `StepProgress`, not `ProgressBar5Step`.
- **Flow-style step components are numbered and named for their content**:
  `Step1SnapPhoto.tsx`, `Step2Name.tsx`, etc. — the number matches the
  Figma frame's step number, the suffix names what the step actually does.
- **File names match the default export / primary component name exactly**
  (`Button.tsx` exports `Button`), including test files
  (`Button.test.tsx`, `a11y.test.tsx` for cross-cutting suites).

## Common pitfalls (things that have already gone wrong once)

- **`React.ChangeEvent`/`React.ReactNode` used without importing `React`.**
  Works fine until real linting catches it — happened more than once across
  different files. Always import the specific type from `"react"` instead
  of relying on the global namespace.
- **Package `exports` maps missing an explicit `"import"` condition.**
  Next.js tolerates a CJS-only `"default"` condition; Vite (Storybook's
  bundler) does not, and fails with an unhelpful error. Any workspace
  package meant to be consumed by both needs explicit `import`/`require`
  conditions.
- **`turbo.json` tasks silently missing `dependsOn: ["^build"]`.** A fresh
  clone that runs `dev`/`storybook`/`lint`/`test` without building
  dependencies first fails with a "failed to resolve entry" style error
  that looks unrelated to the real cause. Any new turbo task that consumes
  another package's build output needs this declared.
- **A component with color variants only gets pull-checked for *one*
  color, and the rest are assumed to follow the same rule.** Button's text
  color was hardcoded white for every variant because only Teal was ever
  actually pulled from Figma closely — Yellow/Green use dark text. Pull
  *every* variant that will actually be used, not just the default.
- **jsdom-based tests (vitest) cannot validate real color contrast** — no
  compiled stylesheet is loaded, so Tailwind utility classes don't resolve
  to real computed colors. Contrast must be checked separately, directly
  against token hex values (a small script), not via `axe-core` in jsdom.
  Document-level axe rules (`region`, `landmark-one-main`,
  `page-has-heading-one`, `html-has-lang`) also need disabling for
  component-level tests — they're false positives on an isolated component.
- **A visually-adjacent value (a gap, a radius, a primitive shade) is
  assumed to be the same everywhere it looks similar.** Two different flow
  steps used two different vertical gaps (20px vs 24px) despite looking
  like the same layout; a "charcoal-600" in code turned out to be named
  "charcoal-700" in Figma for the identical hex value. Verify the actual
  value per instance rather than assuming consistency.
- **FUSE-mounted project folders don't support the file operations
  `pnpm install` needs** (fails on `unlink`). Don't try to install/build
  directly in a mounted folder if this happens — copy to a scratch
  directory, work there, copy corrected source (never `node_modules`/
  `dist`) back.
- **Sandboxed environments with an outbound network allowlist can silently
  block a required download** (e.g. `playwright install chromium` returning
  a 403 from `cdn.playwright.dev`). If a tool needs a network resource that
  isn't reachable, don't force it or fake success — build/verify what's
  possible, document the exact blocker, and hand off the remaining step.

## Recurring instructions

- **Update `TODO.md` and `DONE.md` at the end of every phase or significant
  change** — `DONE.md` gets a dated, detailed record of what was built and
  why (including bugs found and fixed); `TODO.md` gets the phase checklist
  updated and any new deferred items added with enough context to pick up
  cold later.
- **Never auto-merge or silently apply a color/spacing value change**
  without flagging it — these are visual/design decisions that need a
  human to look at them, even when the "fix" seems obviously correct.
- **Full verification before calling anything done**: clean install →
  build → typecheck → lint → test across every affected workspace package,
  from a fresh scratch copy, not incremental/cached state.
- **Don't tag a version release (e.g. v1.0) unless explicitly told to** —
  finishing a phase's work is not the same as being asked to cut a release.
- **When pushing a fix back into the live Figma file, ask first**, inspect
  the current state before writing, make the smallest targeted change, and
  verify the result (`get_variable_defs`/`get_screenshot`) before reporting
  it done.
- **Load the relevant Figma skill (`figma-design-to-code` before
  `get_design_context`, `figma-use` before `use_figma`) every time** — they
  encode hard-won gotchas (page-switching rules, font-loading recipes,
  variable-alias patterns) that aren't obvious from the tool signature
  alone and silently break scripts if skipped.
