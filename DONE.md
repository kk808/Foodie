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

## Notes on verification process

The mounted project folder (`D:\wh\github\Foodie`) is on a filesystem that doesn't support the file operations `pnpm install` needs (FUSE mount, fails on `unlink`). All installs/builds were verified by copying the repo to `/tmp` in the sandbox, running `pnpm install && pnpm build` there, then copying corrected source back — never node_modules/dist. If build issues show up in a future session, this is why: verification happens in a scratch copy, not the mounted folder directly.

## Deferred / not done

See `TODO.md` for the sync workflow item. Also not yet done, lower priority:

- Storybook Foundations page (`apps/docs/stories/Foundations.stories.mdx`) is still Phase 0 placeholder text — doesn't render live from `@foodie/tokens` yet
- Dark mode token collection (plan says the pipeline extends cleanly to it later, not attempted)
