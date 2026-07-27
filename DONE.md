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

## Bug fixes reported by the user (post-Phase 2)

- **`turbo.json`'s `storybook` and `dev` tasks never declared `dependsOn: ["^build"]`.** On a fresh clone (`pnpm install` then straight to `pnpm run storybook`, no `pnpm run build` first), Storybook failed with `Failed to resolve entry for package "@foodie/ui"` because `packages/ui`/`packages/tokens` had no `dist/` yet — `foodie-web`'s `dev` task had the identical latent bug, just hadn't been hit. Fixed by adding the dependency to both tasks.
- **Button height/border bug.** `Button` had a permanent 3px transparent border (reserving space so focus wouldn't shift layout), which added 6px to every button's height — Figma's actual Default/Hover/Disabled frames have no border at all (52px tall: `py-lg` × 2 + 20px line-height). Fixed by dropping the border entirely and switching the focus treatment to `outline` instead of `border` — same visual ring, but outline sits outside the box and never affects size, so focus doesn't resize the button either (Figma's own Focus frame does grow via a real border, which is fine for a static frame but would cause a layout jump in a real interactive button).
- **Storybook `addon-essentials` version drift** (`8.6.14` vs. `8.6.18` for the rest of Storybook) was suspected as the cause of a persistent `Foundations.stories.mdx` "No matching indexer found" warning. Pinning exact matching versions fixed the drift warning but *not* the indexer warning — turned out to be unrelated (see below, fixed by the v10 upgrade instead).

## Storybook 8.6 → 10.5 upgrade (post-Phase 2)

- Bumped `storybook`, `@storybook/react`, `@storybook/react-vite`, `@storybook/addon-a11y` to `10.5.4` (all pinned to the exact same version — learned that lesson the hard way earlier, see version-drift note above)
- Removed `@storybook/addon-essentials` entirely — it was removed as a package in Storybook 9 (docs/controls/actions/viewport/etc. all moved into core), so declaring it as a dependency or listing it in `.storybook/main.ts`'s `addons` array would now just be dead weight
- Bonus: the persistent `Foundations.stories.mdx` "No matching indexer found" warning (the dead leftover file from Phase 2 that couldn't be deleted from the sandbox's FUSE mount) is gone under Storybook 10 — build and dev server both come up completely clean now
- Verified: full build, `storybook dev` startup (`Storybook ready!` banner), typecheck, lint, and tests all pass clean from a fresh install

## Phase 3 — Composite + pattern components

Pulled exact structure from Figma before writing any code: Stat Tile (nodes
`5:2`/`5:5`/`5:8`, one per color), Star Rating (`5:13` rating=0, `5:19`
rating=1, to see the filled-vs-empty star assets), Progress Step Bar
(`5:73` step=1, `5:79` step=2), Discovery List Item (`5:54`, already pulled
in Phase 1 for the Shadow/Card token).

- `StatTile` (`packages/ui/src/components/StatTile.tsx`): 3 color variants (teal/orange/pink), 104×76px, `p-md` (Figma uses 12px here, not the 16px `p-lg` Button uses — easy to get wrong copying between components, double-checked against the actual pulled structure)
- `StarRating` (`StarRating.tsx`): Figma exports the star as an *image* asset hosted on a temporary 7-day Figma URL — not something to embed in real code, so this renders an inline SVG star instead, toggling color between the `rating-star` (filled) and `border-subtle` (empty) tokens. Supports `readOnly` (default, renders as a single `role="img"` with a computed label) and interactive mode (`onChange` renders 5 `role="radio"` buttons, keyboard-focusable with the same outline treatment as Button)
- `StepProgress` (`StepProgress.tsx`): segmented bar, `role="progressbar"` with real `aria-valuenow`/`aria-valuemax`, segments up to `currentStep` filled with `brand-primary`, rest `border-subtle`
- `DiscoveryListItem` (`DiscoveryListItem.tsx`): composes `StarRating` internally; `w-full` instead of Figma's fixed 360px frame width (same reasoning as `TextField` in Phase 2 — a card should size to its container). Figma's icon slot is a plain colored square with no glyph, so `icon` is an optional `ReactNode` prop with nothing rendered by default (see TODO.md)
- All four exported from `packages/ui/src/index.ts`; Storybook stories added for each (`Composite/StatTile`, `Composite/StarRating`, `Composite/StepProgress`, `Pattern/DiscoveryListItem`) with controls mirroring the Figma variant matrix
- 16 new vitest tests across the 4 components (rendering, variant classes, ARIA attributes, the `StarRating` interactive click path via `@testing-library/user-event` — added as a new devDependency)
- No new bugs surfaced this phase — full verification (install → test → typecheck → lint → build, including the Storybook production build) passed clean on the first attempt after writing the components, unlike every previous phase

## Phase 4 — Layout helpers + Code Connect

Pulled the Screens page from Figma (`1:54` — not visible via the no-arg
`get_metadata` page listing, same intermittent issue as Phase 1; found by
guessing the sequential node id `1:54` right after Foundations `1:52` and
Components `1:53`) to see how Home and the 5 flow-step frames are actually
built, before writing either component.

- `FlowHeader` (`packages/ui/src/components/FlowHeader.tsx`): the close button + `StepProgress` row plus "Step X of 5" caption that appears identically on all 5 flow screens (e.g. node `7:37` + `7:45`). Composes the existing `StepProgress` rather than reimplementing the segmented bar. `onClose` is optional; the close button gets the same `outline`-based focus treatment as `Button`/`StarRating`. Exported from `packages/ui/src/index.ts`; `Layout/FlowHeader` Storybook story added
- `ScreenShell` (the 390px mobile frame every screen shares) was originally built as a `@foodie/ui` component, then **moved to `apps/foodie-web/src/components/ScreenShell.tsx`** after review: it's an app page-frame concern (viewport width, route-level background), not a reusable design-system primitive another app would want — unlike `FlowHeader`, which is a genuine composed UI pattern. The vertical rhythm still varies by a `variant: "home" | "flow"` prop (Home node `6:9`: `pt-[60px]`/`gap-[20px]`/`items-start`; flow steps e.g. `7:36`: `pt-[50px]`/`gap-xl`/`items-center`). The old `packages/ui` copy (component, test, and Storybook story) was deleted outright once file-delete permission was granted for the folder — earlier attempts had left neutralized dead stubs behind because the FUSE mount rejected `rm`; once deletion was allowed, the real files were removed and nothing is left behind in `packages/ui` or `apps/docs/stories` referencing `ScreenShell`
- 6 new vitest tests for `FlowHeader` (close callback, step label, custom `totalSteps`, progress ARIA) — 22 total across the package, all passing
- Full verification (install → build → test → typecheck → lint, all 6 workspace packages) passed clean from a fresh `/tmp` scratch copy, both before and after the `ScreenShell` move

**Figma Code Connect mapping — blocked, not done.** Every Code Connect MCP
tool (`add_code_connect_map`, `get_context_for_code_connect`,
`get_code_connect_suggestions`) returned the same error regardless of which
component node was targeted: *"You need a Dev or Full seat on an
Organization or Enterprise plan to use Code Connect."* This is a Figma
account/team plan restriction, not a code or config issue — nothing to fix
from this repo. The intended mapping (component → Figma node) is recorded in
`TODO.md` so it's a five-minute job once the plan/seat allows it.

## Phase 5 — `foodie-web` scaffold + Home screen

- Fixed a leftover bug in `ScreenShell` while wiring it into a real page: the `"home"` variant used `gap-lg` (16px), but Figma's Home frame (`6:9`) uses a literal `gap-[20px]` — a value the spacing scale doesn't have a token for (it jumps from `lg` 16px to `xl` 24px). Corrected to `gap-[20px]` before building on top of it.
- `apps/foodie-web/src/app/page.tsx` now builds the real Home screen from `ScreenShell` (`variant="home"`) + `@foodie/ui`'s `Typography`, `StatTile`, `DiscoveryListItem`, and `Button` — no hand-rolled markup standing in for a design-system component. Matches Figma node `6:9`: greeting block, 3 stat tiles (teal/orange/pink), 2 discovery list items (Sushi/Ramen), a full-width CTA button, and a caption. The stat tiles use `className="flex-1"` to stretch edge-to-edge in their row — `StatTile`'s own `w-[104px]` is a `flex-basis`-losing width once `flex-1` sets an explicit `flex-basis: 0%`, so this works without needing a new StatTile variant.
- No interactivity wired yet — the "+ Try Something New" button has no `onClick`. That's Phase 6 (flow steps + local state), not Phase 5.
- `apps/foodie-web/src/app/layout.tsx`: `<body>` now gets `min-h-screen bg-bg-canvas` so the canvas background covers the full viewport outside the 390px frame too, not just inside `ScreenShell`.
- Verified clean: full workspace build (including `next build`'s static prerender of `/`), typecheck, lint, and all 19 `@foodie/ui` tests, from a fresh `/tmp` scratch copy. Also started the real `next dev` server and fetched the rendered HTML to confirm the actual DOM output — every expected class and piece of content (spacing tokens, star SVGs, discovery items, button label) is present exactly as built, not just "looks right in the editor."

## Notes on verification process

The mounted project folder (`D:\wh\github\Foodie`) is on a filesystem that doesn't support the file operations `pnpm install` needs (FUSE mount, fails on `unlink`). All installs/builds were verified by copying the repo to `/tmp` in the sandbox, running `pnpm install && pnpm build` there, then copying corrected source back — never node_modules/dist. If build issues show up in a future session, this is why: verification happens in a scratch copy, not the mounted folder directly.

## Deferred / not done

See `TODO.md` for the full list (sync workflow, eslint-config-next, TextField error styling, Tailwind color-naming collision, DiscoveryListItem icon content, Figma Code Connect mapping — blocked on plan/seat). Also not yet done, lower priority:

- Dark mode token collection (plan says the pipeline extends cleanly to it later, not attempted)
