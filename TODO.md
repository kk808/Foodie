# TODO

## Phases (build plan §9)

- [x] Phase 0 — Monorepo scaffold (Turborepo + pnpm), tooling config, CI skeleton — no registry setup
- [x] Phase 1 — `@foodie/tokens` built and consumed locally via `workspace:*`
- [x] Phase 2 — `@foodie/ui` primitives (Button, TextField) + Storybook live
- [x] Phase 3 — Composite + pattern components (StatTile, StarRating, StepProgress, DiscoveryListItem)
- [x] Phase 4 — Layout helpers (FlowHeader in `@foodie/ui`, ScreenShell in `foodie-web`); Code Connect mapping to Figma (mapping blocked — see below)
- [x] Phase 5 — `foodie-web` scaffold (Next.js), Home screen built from library
- [x] Phase 6 — Steps 1–5 flow built, wired to local state
- [x] Phase 7 — Accessibility hardening + visual regression baselines generated and committed (21 stories, `apps/docs/visual-regression/baselines/`)
- [ ] Trigger-based (not scheduled) — stand up private registry + Changesets publish job once app #2 needs `@foodie/ui`/`@foodie/tokens` externally

See `DONE.md` for details on what Phases 0–5 actually involved.

---

Deferred items — not blocking current phase work, but should be picked up later.

## eslint-config-next (Phase 2)

`apps/foodie-web` currently lints with the shared monorepo preset
(`packages/config/eslint-preset.js`), not `eslint-config-next` — so it's
missing Next-specific rules (`no-img-element`, etc.).

Cause: `eslint-config-next` + `FlatCompat` (the standard way to use it under
ESLint 9 flat config) throws `TypeError: Converting circular structure to
JSON` inside `@eslint/eslintrc`'s config validator when resolving
`next/core-web-vitals`, under Next.js 16.2 specifically. This looks like a
Next 16 + flat-config-compat bug, not something wrong in this repo — worth
retrying once Next/eslint-config-next put out a few more patch releases.

Also: Next 16 removed the `next lint` CLI command entirely (`apps/foodie-web`'s
lint script now calls `eslint .` directly, like every other package).

## Error state for TextField (Phase 2)

`<TextField error>` sets `aria-invalid`/`data-error` but has no visual
styling — the Figma file has no error/invalid color token. Wire the real
style in once one exists (`packages/ui/src/components/TextField.tsx`).

## Tailwind color primitive naming collision (Phase 2, low priority)

`packages/tokens`'s primitive palette reuses several of Tailwind's default
color family names (`teal`, `orange`, `pink`, `yellow`, `green`, `gray`).
Extending `theme.colors.teal.500` etc. only overrides that specific shade —
other shades in the same family (e.g. `bg-teal-100`) silently fall back to
Tailwind's stock palette instead of erroring, which could confuse someone
reaching for a shade outside what Figma defines. Not a bug in anything built
so far (only the defined shades are used), but worth a naming pass
(e.g. prefixing) if it ever causes real confusion.

## DiscoveryListItem icon content (Phase 3)

The Figma file's Discovery List Item (node `5:54`) has just a plain colored
square in the icon slot — no glyph, emoji, or photo. `DiscoveryListItem`'s
`icon` prop accepts an optional `ReactNode` for this reason, but nothing
renders there by default. Once the design defines what actually goes in that
slot (food category icon? photo thumbnail?), wire the real default in
(`packages/ui/src/components/DiscoveryListItem.tsx`).

## Figma Code Connect mapping (Phase 4)

Every Code Connect MCP tool (`add_code_connect_map`, `get_context_for_code_connect`,
`get_code_connect_suggestions`) returned the same error for this Figma file:

> You need a Dev or Full seat on an Organization or Enterprise plan to use
> Code Connect.

This is an account/plan-level restriction on the connected Figma
account/team, not something fixable from the codebase — Code Connect
(both publishing and even reading component properties for template
generation) requires an Organization or Enterprise seat, which this file
isn't on.

Once the plan/seat is upgraded, the mapping is straightforward — component
node IDs on the Components page (node `1:53`) are already known:

- Button → `4:22` → `packages/ui/src/components/Button.tsx`
- Input Field → `5:71` → `packages/ui/src/components/TextField.tsx`
- Stat Tile → `5:11` → `packages/ui/src/components/StatTile.tsx`
- Star Rating → `5:49` → `packages/ui/src/components/StarRating.tsx`
- Discovery List Item → `5:54` → `packages/ui/src/components/DiscoveryListItem.tsx`
- Progress Step Bar → `5:103` → `packages/ui/src/components/StepProgress.tsx`
- Flow header row (Screens page, e.g. node `7:37`) → `packages/ui/src/components/FlowHeader.tsx`
- Screens page (`1:54`) → `apps/foodie-web/src/components/ScreenShell.tsx` (app-level, not `@foodie/ui` — see note below)

## Home not wired to saved flow entries (Phase 6)

`/log`'s final step (`Step5Notes`) `console.log`s the completed `FoodEntry`
and redirects to `/`, but Home's stats (`47`/`8`/`🍕`) and the two
Discovery List Items are still Phase 5's static demo content — nothing
persists a saved entry yet (no store, no backend). Wire this up once there's
an actual data layer to write to; out of scope for "build the flow" itself.

## Textarea design-system gap (Phase 6)

Step 5's notes field (`apps/foodie-web/src/components/flow/Step5Notes.tsx`)
is a hand-styled `<textarea>`, not a `@foodie/ui` component — Figma's node
(`9:80`) is a bespoke yellow-bordered Frame, not an "Input Field" instance,
so there was nothing to reuse from `TextField`. If a second multi-line text
input ever shows up in the design, promote this to a proper `@foodie/ui`
`TextArea` instead of copy-pasting the local styling again.

## Button/StatTile contrast on brand colors (Phase 7 finding, not fixed)

Computing WCAG contrast ratios directly against the token hex values found
several button/text combinations that fail AA's 4.5:1 for normal text:

- White button label text on Teal (`brand-primary`, 2.59:1) and Orange
  (`accent-orange`, 2.07:1) — both well under 4.5:1
- White button label text on Pink (`accent-pink`, 3.59:1) — also under
- Filled rating star (`rating-star`, gold) against its own empty-star color
  (`border-subtle`) is only 1.52:1 — the two states are hard to tell apart
  by color alone for low-vision users
- `border-subtle` against `bg-surface` (white) is 1.20:1, well under the
  3:1 required for UI-component boundaries (TextField's default border)

Not changed here: these are core brand colors (Teal is literally
`brand-primary`) and the accent palette, not incidental values — changing
them is a design decision needing sign-off, same reasoning as the sync
workflow note below ("never auto-merge color changes, they need eyes").
Yellow and Green buttons are fine (10.11:1 and 5.70:1 with dark text, the
Phase 6 fix). Flagging here for whoever owns the palette; the `text/secondary`
fix (below) was safe to make unilaterally in a way these aren't, because it
reused an already-approved primitive from the same palette instead of
picking a new color.

## `text/secondary` — code and Figma now back in sync (Phase 7)

Fixed via the Figma MCP's `use_figma` tool: `color/text/secondary`
(`VariableID:1:21`) was aliased to `color/charcoal-500` (3.4–3.6:1 contrast,
fails AA); re-aliased it to the same darker primitive `color/focus/ring`
already used (`VariableID:23:2`, 7.0–7.4:1), not a new color. Verified via
`get_variable_defs` that it now resolves to `#575551`, matching
`packages/tokens`'s `text/secondary` value exactly. That primitive was also
renamed from `color/charcoal-700` to `color/charcoal-600` (below) to match
`packages/tokens`'s naming, so both the value and the name now line up on
both sides — no more divergence between the design file and the shipped
app.

Naming mismatch that turned up in the process (now resolved): what
`packages/tokens/tokens/primitive.json` calls `charcoal.600` (`#575551`)
was the same hex value Figma's variables panel called `color/charcoal-700`.
Renamed the Figma variable (`VariableID:23:2`) to `color/charcoal-600` —
verified `color/text/secondary` and `color/focus/ring` (both alias it by
ID, not name) still resolve correctly after the rename.

## Sync workflow (build plan §2)

Automate the Figma → code token pipeline instead of pulling values manually:

- Script that re-pulls variables from Figma (Variables REST API or Tokens Studio export)
- Diffs against the current `packages/tokens/tokens/*.json`
- Opens a PR with the diff for review — never auto-merge color/spacing changes, since they're visual and need eyes on them
- Could run on a schedule or be triggered manually

Status: done manually via the Figma MCP tools during Phase 1 (see `packages/tokens/tokens/*.json` — 17 primitives, semantic, typography, spacing, radius, shadow, all sourced from the Foodie App Design System Figma file, node `1:52`). No automated re-pull/PR script exists yet.
