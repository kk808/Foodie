# CLAUDE.md — Project Handoff

Handoff doc for future Claude sessions working on this repo. Written after
a session that implemented Phase 6 (flow steps), Phase 7 (accessibility +
visual regression), and pushed one fix back to the Figma source file. See
`TODO.md` (what's left / known gaps) and `DONE.md` (full phase-by-phase
history, more detail than this doc) for the long version — this file is the
orientation layer on top of those two.

## Project goal

Foodie is a food-discovery app being built **design-system-first**: every
screen is assembled from a shared component library (`@foodie/ui`) that is
itself built from design tokens (`@foodie/tokens`) pulled directly from a
Figma file, not hand-guessed. The build plan (referenced throughout
`DONE.md`/`TODO.md` as "build plan §N") runs in phases — tokens, then
primitives, then composite components, then layout, then the actual app
screens, then hardening. Phases 0–7 are done; see below for what's left.

**Figma file:** "[Foodie App Design System](https://www.figma.com/design/TGPclDtmNDOvL2fdM0C0ML/)", file key `TGPclDtmNDOvL2fdM0C0ML`.
Key pages: Foundations (`1:52`, tokens), Components (`1:53`, the component
library), Screens (`1:54`, Home + the 5 flow-step frames).


## Current architecture

Turborepo + pnpm workspace monorepo:

```
apps/
  foodie-web/     Next.js 16.2 (App Router, React 19.2) — the actual app
  docs/           Storybook 10.5 — component library documentation + a11y/visual-regression tooling
packages/
  tokens/         @foodie/tokens — Style Dictionary pipeline, Figma-sourced design tokens
  ui/             @foodie/ui — the component library (design-system primitives/composites)
  config/         @foodie/config — shared tsconfig/tailwind/eslint presets
```

- **Tokens → Tailwind**: `packages/tokens/tokens/*.json` (primitive, semantic,
  typography, spacing, radius, shadow) → Style Dictionary → generates
  `dist/tokens.css` (CSS vars), `src/generated/tokens.generated.ts` (flat TS
  consts), and `src/generated/tailwind-theme.generated.ts` (a
  `theme.extend`-shaped object). `packages/config/tailwind.config.ts` imports
  the generated theme; every app/package consumes Tailwind classes like
  `bg-brand-primary`, `text-text-secondary`, `p-md`, `rounded-lg` — never raw
  hex/px values. Generated files are gitignored and rebuilt via
  `pnpm run tokens:build` (also runs automatically via `pretypecheck`/`prelint`
  hooks).
- **Component library** (`@foodie/ui`): Button, TextField, Typography
  (primitives) → StatTile, StarRating, StepProgress, DiscoveryListItem
  (composite) → FlowHeader (layout). All CVA-based where there are color/size
  variants. Consumed by `foodie-web` via `workspace:*` + Next's
  `transpilePackages` — **no publish/registry step exists yet, on purpose**
  (deferred until a second consuming app exists).
- **`foodie-web` app**: `src/app/page.tsx` is the Home screen. `src/app/log/
  page.tsx` is the "+Try Something New" flow — a single route holding all 5
  steps as client-side `useState`, not 5 separate routes (see "Important
  decisions" below). Step components live in
  `src/components/flow/Step1SnapPhoto.tsx` ... `Step5Notes.tsx`. `ScreenShell`
  (`src/components/ScreenShell.tsx`) is the shared 390px mobile-frame wrapper
  — deliberately **not** in `@foodie/ui` (it's an app page-frame concern, not
  a reusable design-system primitive).
- **Storybook** (`apps/docs`): one stories file per `@foodie/ui` component,
  plus a live Foundations page that renders the actual generated token
  values (no hand-copied swatches). `@storybook/addon-a11y` is wired in for
  interactive a11y checking. `apps/docs/visual-regression/` is a custom
  Playwright + pixelmatch screenshot-diff tool (see below).

## Files changed this session (Phase 6 + 7 + Figma sync)

**Phase 6 — flow steps:**
- `apps/foodie-web/src/app/log/page.tsx` (new) — the flow route/state machine
- `apps/foodie-web/src/components/flow/Step1SnapPhoto.tsx` ... `Step5Notes.tsx` (new)
- `apps/foodie-web/src/app/page.tsx` — wired "+ Try Something New" to `router.push("/log")`, became a client component
- `packages/ui/src/components/Button.tsx` — text color now varies per color variant (bug fix, see below)
- `packages/ui/src/components/StarRating.tsx` — added `size?: "sm" | "lg"` prop
- `apps/foodie-web/src/components/ScreenShell.tsx` — added `gapPx` override prop

**Phase 7 — accessibility + visual regression:**
- `packages/ui/src/test/axe-setup.ts` (new), `axe-matchers.d.ts` (new) — jest-axe wiring for vitest
- `packages/ui/src/components/__tests__/a11y.test.tsx` (new) — axe checks per component
- `packages/ui/src/components/StepProgress.tsx` — added `aria-label` (bug fix, see below)
- `apps/foodie-web/src/components/flow/Step3Location.tsx`, `Step5Notes.tsx` — added `aria-describedby` linking optional-field captions
- `packages/tokens/tokens/semantic.json` — `text/secondary` re-aliased from `charcoal.500` to `charcoal.600`
- `apps/docs/visual-regression/run.mjs` (new), `README.md` (new), `baselines/*.png` (new, 21 files, generated by the user outside this sandbox)
- `apps/docs/package.json`, `turbo.json`, root `package.json`, `.gitignore` — wiring for `test:visual`/`test:visual:update`
- `packages/ui/package.json` — added `jest-axe`, `@types/jest-axe`
- `apps/docs/package.json` — added `playwright`, `pixelmatch`, `pngjs`

**Figma file itself** (via the Figma MCP's `use_figma` tool, not a code file but worth logging here):
- `color/text/secondary` variable re-aliased from `color/charcoal-500` to what is now `color/charcoal-600` (was `color/charcoal-700` until renamed — see below)
- That primitive variable renamed from `color/charcoal-700` to `color/charcoal-600` to match `packages/tokens`'s naming

All changes are recorded in detail, phase by phase, in `DONE.md`.

## Important decisions and why

- **`/log` is one route with local `useState`, not 5 routes.** Nothing in
  the flow needs to be deep-linkable or shareable mid-flow, so a single
  `FoodEntry` draft object threaded through by step index is simpler than
  routing/URL state or a shared store.
- **Pull from Figma before writing any component code, every time.** Every
  phase in `DONE.md` starts with `get_metadata`/`get_design_context` calls
  before implementation. This caught real, non-obvious bugs (see "Known
  bugs" below) that would not have been caught by guessing from the
  screenshot alone.
- **Reuse tokens/components instead of inventing new ones.** When a gap was
  found (e.g. `StarRating` needed a larger size for the flow's rating step),
  the fix was a new prop on the existing component, not a parallel
  component. When the `text/secondary` contrast fix needed a darker gray,
  it re-aliased to an *already-approved* primitive (`charcoal-600`,
  previously only used for `focus-ring`) rather than inventing a new color.
- **Visual/brand color changes need a human, token-reuse fixes don't.**
  Several WCAG contrast failures were found in Phase 7 (see below). Only
  the one that could be fixed by repointing to an *existing* palette color
  was changed unilaterally; genuine brand-color decisions (button text on
  Teal/Orange/Pink) were left alone and flagged in `TODO.md` instead — same
  policy as the sync-workflow note: "never auto-merge color changes, they
  need eyes."
- **Figma is being kept in sync with code, not the other way around.** When
  the `text/secondary` code fix was made, it was reported to the user as a
  divergence from the Figma source of truth. On explicit request, the fix
  (and a related naming cleanup) was pushed back into Figma via `use_figma`,
  re-verified with `get_variable_defs` after each change. Don't assume
  Figma and code silently stay in sync — check when it matters.
- **A hand-written Playwright script instead of `@storybook/test-runner`**
  for visual regression — pinning a test-runner version compatible with
  Storybook 10.5 wasn't verified, and a ~150-line script has less surface
  area to go stale against a fast-moving Storybook major.
- **`ScreenShell` and the flow-step components live in `foodie-web`, not
  `@foodie/ui`** — they're app/page-frame concerns (viewport width, route
  background, per-screen copy) not reusable design-system primitives. `FlowHeader`
  *is* in `@foodie/ui` because it's a genuine composed UI pattern used
  identically across all 5 steps.

## TODO list

Full detail in `TODO.md`. Summary:

- [ ] **Trigger-based, not scheduled** — stand up a private registry +
  Changesets publish job once a second app needs `@foodie/ui`/`@foodie/tokens`
  externally. Not urgent.
- [ ] `eslint-config-next` isn't wired into `foodie-web`'s lint config (Next
  16.2 + flat-config-compat bug in `eslint-config-next` + `FlatCompat`) —
  retry once upstream patches land.
- [ ] `TextField`'s `error` prop is scaffolded (`aria-invalid`/`data-error`)
  but unstyled — no error/invalid token exists in Figma yet.
- [ ] Tailwind color-primitive naming collision (`teal`/`orange`/`pink`/etc.
  shadow Tailwind's own palette names) — low priority, only worth a
  prefixing pass if it causes real confusion.
- [ ] `DiscoveryListItem`'s icon slot has no defined content in Figma (plain
  colored square) — `icon` prop exists but nothing renders by default.
- [ ] Figma Code Connect mapping — blocked on a Figma plan/seat upgrade
  (Dev/Full seat on Org/Enterprise). Node-ID mapping is already recorded in
  `TODO.md`, five-minute job once unblocked.
- [ ] Home's stats/discoveries are still static Phase 5 demo content — `/log`
  doesn't persist a saved `FoodEntry` anywhere (no backend/store exists yet).
- [ ] Step 5's notes field is a hand-styled `<textarea>`, not a `@foodie/ui`
  component (Figma treats it as bespoke, not an Input Field instance) —
  promote to a real `TextArea` component if a second multi-line field ever
  shows up in the design.
- [ ] Button/StatTile contrast on brand colors — **flagged, not fixed**, see
  "Known bugs" below.
- [ ] Automate the Figma → token sync (currently done manually via Figma MCP
  tools every phase) — script + diff + PR, never auto-merge.
- [ ] Dark mode token collection — not attempted, plan says the pipeline
  extends cleanly to it later.

## Known bugs (real, unfixed WCAG contrast failures)

Computed directly against `packages/tokens/tokens/*.json` hex values
(WCAG relative-luminance contrast ratios — can't be checked via `axe-core`
in jsdom, see Coding Conventions below):

- White button label text on Teal (`brand-primary`, **2.59:1**) and Orange
  (`accent-orange`, **2.07:1**) — both fail AA's 4.5:1 badly.
- White button label text on Pink (`accent-pink`, **3.59:1**) — also fails.
- Filled rating star vs. its own empty-star color: **1.52:1** — the two
  states are hard to distinguish by color alone.
- `border-subtle` vs. `bg-surface` (white): **1.20:1** — well under the 3:1
  needed for UI-component boundaries (e.g. `TextField`'s default border).

None of these were fixed — they're core brand-color decisions needing
design sign-off, not incidental values. Yellow/Green buttons are fine
(10.11:1 / 5.70:1, fixed in Phase 6). `text/secondary` was fixed (was
3.4–3.6:1, now 7.0–7.4:1) because that one *could* reuse an already-approved
palette color instead of picking a new one.

## Constraints

- **The mounted project folder is on a FUSE mount that doesn't support the
  file operations `pnpm install` needs** (fails on `unlink`). Every
  install/build/test in this project's history has been done by copying the
  repo to a `/tmp` scratch directory in the sandbox, running
  `pnpm install && pnpm build/test/lint/typecheck` there, then copying
  *corrected source only* back — never `node_modules`/`dist`. If something
  looks unbuildable directly in the mounted folder, this is why.
- **The sandbox's outbound network is allowlisted and blocks
  `cdn.playwright.dev`** — `playwright install chromium` returns a 403.
  Visual regression (`pnpm test:visual`) cannot be run end-to-end from this
  sandbox; it needs a real network to install a browser. The 21 committed
  baselines were generated by the user outside this sandbox.
- **Figma Code Connect requires a Dev/Full seat on an Organization/
  Enterprise plan**, which the connected Figma account doesn't have. Every
  Code Connect MCP tool call fails with the same seat-upgrade error.
  Read-only Figma tools (`get_design_context`, `get_metadata`,
  `get_variable_defs`, `get_screenshot`) and `use_figma` (writes via the
  Plugin API) both work fine and don't require this seat.
- **pnpm workspace, Node ≥20, TypeScript 6.0 (not 7.0 — ecosystem tooling
  hasn't caught up yet), Tailwind v3.4 (not v4 — would require reworking the
  token pipeline).**

## Coding conventions

- **Pull from Figma before writing component code.** `get_metadata` to find
  the right node, `get_design_context` for exact structure/copy/colors,
  `get_screenshot` to sanity-check. Never guess a value.
- **Every component/token has a doc comment citing the Figma node ID(s) it
  was built from** (e.g. `// Matches the Figma Button component (Components
  page, node 4:22)`) and explains *why* whenever the code deviates from a
  literal Figma value (e.g. arbitrary `rounded-[10px]` instead of a token,
  `gapPx` overrides, etc.). Keep doing this — it's what makes the "why"
  traceable months later.
- **Tailwind classes reference tokens, never raw values** — `bg-brand-primary`
  not `bg-[#43b1a8]`, `p-md` not `p-[12px]`, unless Figma's literal value
  genuinely doesn't match any token (documented inline when this happens,
  e.g. Home's 20px gap, Step 2's 10px photo-preview radius).
- **CVA (`class-variance-authority`) for any component with color/size
  variants** (Button, StatTile). Plain prop-driven class arrays for simpler
  components.
- **`@foodie/ui` vs. app-level (`foodie-web`) placement test:** would a
  second app want this as a generic primitive/pattern? If yes →
  `@foodie/ui`. If it's about viewport framing, route structure, or
  one-off screen copy → app-level. (`FlowHeader` vs. `ScreenShell`/flow
  steps is the reference example.)
- **Every fix gets full verification before being considered done**: clean
  install → build → typecheck → lint → test, all 6 workspace packages, from
  a fresh scratch copy — not just "it typechecks." Real bugs in this project
  were consistently caught by *running* things, not by reading code (see
  `DONE.md` for the long list: broken exports maps, missing eslint install,
  contrast failures, missing aria-labels, etc.).
- **axe-core / jsdom limitation**: `packages/ui`'s vitest a11y tests disable
  the `color-contrast` rule and document-level rules (`region`,
  `landmark-one-main`, `page-has-heading-one`, `html-has-lang`) — jsdom has
  no compiled stylesheet to check real computed colors against, and
  document-level rules don't apply to a component mounted in isolation.
  Contrast is checked separately, directly against token hex values.

## Commands to build/test

From repo root (or scoped with `--filter <package>` / `pnpm --filter <pkg> run <script>`):

```
pnpm install                # workspace install
pnpm build                  # turbo run build, all packages (tokens → ui → docs/foodie-web)
pnpm typecheck              # turbo run typecheck
pnpm lint                   # turbo run lint
pnpm test                   # turbo run test (currently only packages/ui has vitest tests — 27 tests, includes a11y)
pnpm storybook              # apps/docs Storybook dev server, port 6006
pnpm test:visual            # apps/docs visual regression — diff against committed baselines (needs a real Chromium; see Constraints)
pnpm test:visual:update     # regenerate + overwrite baselines
```

Package-specific:
```
pnpm --filter @foodie/tokens run tokens:build   # regenerate CSS/TS/Tailwind-theme from tokens/*.json
pnpm --filter @foodie/ui run test               # vitest run, packages/ui only
pnpm --filter foodie-web run dev                # next dev
```

**If working in this same kind of sandboxed environment**: don't run these
directly against a FUSE-mounted project folder — copy to `/tmp`, install
there, verify there, copy corrected source back. See Constraints.

## Open questions

- **Button/StatTile brand-color contrast failures** (Teal/Orange/Pink white
  text) — needs a decision from whoever owns the Figma palette: darken the
  brand colors, or find another way to hit 4.5:1? Not actioned yet.
- **Rating-star / border-subtle contrast** — same category, no owner
  decision yet.
- **Should `/log` ever become deep-linkable per-step?** Current design
  explicitly decided no (see Important Decisions), but if analytics/sharing
  requirements show up later this should be revisited.
- **When does Home get wired to real saved entries?** No data layer exists
  yet — first real integration point once one does.
- **Visual regression baselines were generated once, outside this sandbox.**
  Nobody has re-run `test:visual` (diff mode, not update mode) against them
  yet to confirm the diff-detection logic actually works end-to-end (only
  the up-to-Chromium-install path was verified from inside the sandbox).
  Worth a real run + an intentional visual change to confirm it correctly
  flags a regression, whenever someone has the network access to do it.
- **v1.0 tag**: explicitly not created yet, per user instruction. Phase 7 is
  done; nothing else is blocking it that hasn't already been surfaced above.

## Anything future Claude should know

- **This session's Figma edits were live writes to the actual design file**,
  not a mockup — `use_figma` runs real Plugin API code against
  `TGPclDtmNDOvL2fdM0C0ML`. Treat any future Figma write the same way:
  inspect first (`get_metadata`/read-only `use_figma`), make the smallest
  targeted change, verify with `get_variable_defs`/`get_screenshot`
  afterward, and don't touch anything not explicitly asked for. Color/value
  changes are a "needs a human to ask for it" category, same as in code.
- **The `figma-design-to-code` skill is mandatory before `get_design_context`
  calls, and `figma-use` is mandatory before `use_figma` calls** — both are
  loaded via `read_skill_uri`/`get_figma_skill` if not already available as
  slash-skills. Don't skip loading them; they contain hard-won gotchas
  (page-switching rules, font-loading recipes, etc.) that silently break
  scripts if ignored.
- **`DONE.md` is genuinely worth reading in full**, not just skimming — it
  documents *why* dozens of small decisions were made, including several
  "looked right in the editor but was actually wrong" bugs that will recur
  in spirit if a future session doesn't know they happened once already
  (e.g. the `React.ChangeEvent`-without-import bug happened twice, in two
  different phases, because it's an easy mistake to make and only lint
  catches it).
- **`TODO.md`'s deferred-items section is a live backlog, not dead notes** —
  each entry has enough context (file paths, node IDs, exact error messages)
  to pick up cold in a future session without re-deriving it.
