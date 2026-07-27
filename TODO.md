# TODO

## Phases (build plan §9)

- [x] Phase 0 — Monorepo scaffold (Turborepo + pnpm), tooling config, CI skeleton — no registry setup
- [x] Phase 1 — `@foodie/tokens` built and consumed locally via `workspace:*`
- [ ] Phase 2 — `@foodie/ui` primitives (Button, TextField) + Storybook live
- [ ] Phase 3 — Composite + pattern components (StatTile, StarRating, StepProgress, DiscoveryListItem)
- [ ] Phase 4 — Layout helpers (ScreenShell, FlowHeader); Code Connect mapping to Figma
- [ ] Phase 5 — `foodie-web` scaffold (Next.js), Home screen built from library
- [ ] Phase 6 — Steps 1–5 flow built, wired to local state
- [ ] Phase 7 — Accessibility + visual regression hardening, v1.0 tag (still unpublished)
- [ ] Trigger-based (not scheduled) — stand up private registry + Changesets publish job once app #2 needs `@foodie/ui`/`@foodie/tokens` externally

See `DONE.md` for details on what Phases 0 and 1 actually involved.

---

Deferred items — not blocking current phase work, but should be picked up later.

## Sync workflow (build plan §2)

Automate the Figma → code token pipeline instead of pulling values manually:

- Script that re-pulls variables from Figma (Variables REST API or Tokens Studio export)
- Diffs against the current `packages/tokens/tokens/*.json`
- Opens a PR with the diff for review — never auto-merge color/spacing changes, since they're visual and need eyes on them
- Could run on a schedule or be triggered manually

Status: done manually via the Figma MCP tools during Phase 1 (see `packages/tokens/tokens/*.json` — 17 primitives, semantic, typography, spacing, radius, shadow, all sourced from the Foodie App Design System Figma file, node `1:52`). No automated re-pull/PR script exists yet.
