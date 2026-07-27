# DONE

Record of what's been completed so far, for context in future sessions. See
`Foodie-Design-System-Build-Plan.md` for the full plan and phase list.

## Phase 0 — Monorepo scaffold

- Turborepo + pnpm workspaces set up: `apps/foodie-web` (Next.js 16.2, React 19.2), `apps/docs` (Storybook 8.3), `packages/tokens`, `packages/ui`, `packages/config` (shared tsconfig/tailwind/eslint)
- TypeScript 6.0 throughout (not 7.0 — too new, ecosystem tooling like tsup/ts-eslint/Storybook docgen hasn't fully caught up yet; had to add `"ignoreDeprecations": "6.0"` to the root tsconfig to work around a `baseUrl` deprecation warning tsup's dts step trips on)
- Tailwind stays on v3.4, not v4 — v4's CSS-native `@theme` config would require reworking `packages/config` and the token pipeline; deferred until there's a reason to migrate
- `foodie-web` consumes `@foodie/ui`/`@foodie/tokens` via Next's `transpilePackages`, no publish/registry step (per build plan §7 — deferred until a second app needs them externally)
- No registry, no Changesets publish job — intentional per the plan
- Full workspace build (tokens, ui, docs, foodie-web) verified clean

## Phase 1 — `@foodie/tokens`

- Pulled real values from the Foodie App Design System Figma file (`TGPclDtmNDOvL2fdM0C0ML`, Foundations page `1:52`) via the Figma MCP tools — manually, not through an automated script (see `TODO.md`)
- 17 primitive colors (including 3 that only showed up when inspecting the Button component's variable defs, not the Foundations swatches: `charcoal-600`, `yellow-600`, `green-600`)
- Full semantic layer aliased to primitives: `bg/canvas`, `bg/surface`, `text/primary`, `text/secondary`, `text/inverse`, `brand/primary` (+hover), `accent/orange|pink|yellow|green` (+hover variants for all four), `border/subtle`, `rating/star`, and `focus-ring` (needed for real `:focus-visible` styling per build plan §4 — this and the accent hover aliases were missing in the first pass, caught when the user asked why only 13/14 primitives showed up instead of 17)
- Typography: 7 text styles (Heading XL/L/M, Body Regular/Medium, Label Caption, Button Label) as flat fontSize/fontWeight/lineHeight tokens
- Spacing scale: 4/8/12/16/24/32px
- Radius scale: 8/12/16/20px + full (9999px)
- Shadow/Card: `0px 2px 6px rgba(33,28,23,0.06)` — pulled from the Discovery List Item component since it wasn't its own swatched frame
- Style Dictionary pipeline (`packages/tokens/style-dictionary.config.js`) generates three outputs from `tokens/*.json`:
  - `dist/tokens.css` — CSS custom properties
  - `src/generated/tokens.generated.ts` — flat TS constants
  - `src/generated/tailwind-theme.generated.ts` — a `theme.extend`-shaped object (colors, spacing, borderRadius, boxShadow)
- Generated files are gitignored (`packages/tokens/src/generated`, `dist/`) — pure build output, regenerated via `pnpm run tokens:build`. `prelint`/`pretypecheck` hooks regenerate automatically so a clean clone doesn't break lint/typecheck.
- `packages/config/tailwind.config.ts` now actually imports `@foodie/tokens/tailwind-theme` (was a commented-out placeholder in Phase 0) — verified it resolves correctly through to `foodie-web`'s production build

## Phase 2 — `@foodie/ui` primitives + Storybook live

- Pulled exact structure from Figma for all Button states (Teal/Orange/Pink/Yellow/Green × Default/Hover/Focus/Disabled, nodes `4:2`–`21:18`) and Input Field (Default/Focused, nodes `5:67`/`5:69`) before writing any component code
- `Button` (`packages/ui/src/components/Button.tsx`): CVA-based, 5 color variants, real `:focus-visible` + `focus-ring` token (not a per-color ring), `disabled` via native attribute + 50% opacity, hover per-color via token aliases
- `TextField` (`TextField.tsx`): Default/Focused via native `:focus`, `error` prop scaffolded (`aria-invalid`/`data-error`) but **not styled** — no error/invalid token exists in Figma yet, see TODO.md
- `Typography` (`Typography.tsx`): all 7 text styles as a variant map, polymorphic `as` prop with sensible per-variant defaults, `color` prop mapping to semantic text tokens
- Extended the Style Dictionary → Tailwind theme generator to also emit `fontFamily` (was colors/spacing/borderRadius/boxShadow only)
- Wired real Tailwind into `apps/docs` (Storybook) — it had no Tailwind config at all before this, so components would have rendered completely unstyled. Added `tailwind.config.ts`, `postcss.config.mjs`, `stories/globals.css` (imports generated `tokens.css` + Tailwind directives, `@import` before `@tailwind` per CSS spec), wired into `.storybook/preview.ts`
- Replaced the Phase 0 Foundations placeholder with a real live-rendering page (`stories/FoundationsPage.tsx` + `Foundations.stories.tsx`) that flattens `@foodie/tokens`'s generated theme object into color swatches, spacing bars, and radius samples — no hand-copied values, closes the gap flagged at the end of Phase 1
- Added Button/TextField/Typography stories with controls mirroring the Figma variant matrix, plus a Button vitest smoke test (render, default color class, variant override, disabled)
- **Real bugs found and fixed during verification** (all caught by actually running installs/builds in the scratch copy, not just reading the code):
  - `@foodie/ui` and `@foodie/tokens` package.json `exports` maps only declared a `"default"` condition pointing at the CJS build — no `"import"` condition for the `.mjs` build. Next.js tolerated this; Vite (Storybook's bundler) didn't, and failed with no useful error message until isolated by bisection. Fixed by adding explicit `import`/`require` conditions to both.
  - The generated `tailwind-theme.generated.ts` used `as const`, making `fontFamily.sans` a readonly tuple — incompatible with Tailwind's mutable `Config` type, breaking `foodie-web`'s typecheck. Removed `as const` from the generator.
  - RTL's automatic per-test DOM cleanup needs Vitest's `globals: true` — without it, tests were bleeding DOM nodes across cases in the same file. Added to `packages/ui/vitest.config.ts`.
  - **eslint was never actually installed anywhere** despite every package having a `lint` script and `packages/config/eslint-preset.js` existing since Phase 0 — `pnpm run lint` was silently broken from the start. Fixed by adding real `eslint`/`@typescript-eslint` devDependencies and wiring `.eslintrc`/`eslint.config.js` files that were never created either.
  - Next.js 16's `eslint-config-next` requires ESLint ≥9, which meant migrating the whole repo's ESLint config from classic `.eslintrc` (v8) to flat config (`eslint.config.js`, v9) — done via `packages/config/eslint-preset.js` now exporting a flat config array.
  - Next.js 16 removed the `next lint` CLI command entirely; `foodie-web`'s lint script now calls `eslint .` directly.
  - `eslint-config-next` + `FlatCompat` throws `TypeError: Converting circular structure to JSON` under Next 16.2 specifically — looks like a Next/flat-config-compat bug, not something in this repo. Deferred; `foodie-web` lints with the shared monorepo preset instead for now (see TODO.md — it's missing Next-specific rules like `no-img-element` until this is revisited)
  - `apps/foodie-web/src/app/layout.tsx` used `React.ReactNode` without importing `React` — worked under the old (nonexistent) lint setup, caught immediately once real linting ran. Fixed to `import type { ReactNode } from "react"`.
- Full verification after every fix: clean install → build → typecheck → lint → test, all 6 workspace packages, from a completely fresh `/tmp` scratch copy (not incremental/cached)

## Notes on verification process

The mounted project folder (`D:\wh\github\Foodie`) is on a filesystem that doesn't support the file operations `pnpm install` needs (FUSE mount, fails on `unlink`). All installs/builds were verified by copying the repo to `/tmp` in the sandbox, running `pnpm install && pnpm build` there, then copying corrected source back — never node_modules/dist. If build issues show up in a future session, this is why: verification happens in a scratch copy, not the mounted folder directly.

## Deferred / not done

See `TODO.md` for the full list (sync workflow, eslint-config-next, TextField error styling, Tailwind color-naming collision). Also not yet done, lower priority:

- Dark mode token collection (plan says the pipeline extends cleanly to it later, not attempted)
