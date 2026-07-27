# TODO

## Phases (build plan §9)

- [x] Phase 0 — Monorepo scaffold (Turborepo + pnpm), tooling config, CI skeleton — no registry setup
- [x] Phase 1 — `@foodie/tokens` built and consumed locally via `workspace:*`
- [x] Phase 2 — `@foodie/ui` primitives (Button, TextField) + Storybook live
- [ ] Phase 3 — Composite + pattern components (StatTile, StarRating, StepProgress, DiscoveryListItem)
- [ ] Phase 4 — Layout helpers (ScreenShell, FlowHeader); Code Connect mapping to Figma
- [ ] Phase 5 — `foodie-web` scaffold (Next.js), Home screen built from library
- [ ] Phase 6 — Steps 1–5 flow built, wired to local state
- [ ] Phase 7 — Accessibility + visual regression hardening, v1.0 tag (still unpublished)
- [ ] Trigger-based (not scheduled) — stand up private registry + Changesets publish job once app #2 needs `@foodie/ui`/`@foodie/tokens` externally

See `DONE.md` for details on what Phases 0, 1, and 2 actually involved.

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

## Sync workflow (build plan §2)

Automate the Figma → code token pipeline instead of pulling values manually:

- Script that re-pulls variables from Figma (Variables REST API or Tokens Studio export)
- Diffs against the current `packages/tokens/tokens/*.json`
- Opens a PR with the diff for review — never auto-merge color/spacing changes, since they're visual and need eyes on them
- Could run on a schedule or be triggered manually

Status: done manually via the Figma MCP tools during Phase 1 (see `packages/tokens/tokens/*.json` — 17 primitives, semantic, typography, spacing, radius, shadow, all sourced from the Foodie App Design System Figma file, node `1:52`). No automated re-pull/PR script exists yet.
