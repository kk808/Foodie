# Foodie

Foodie is a food-discovery app, built **design-system-first**: every screen
is assembled from a shared component library (`@foodie/ui`) that is itself
built from design tokens (`@foodie/tokens`) pulled directly from Figma design.

**Figma:** [Foodie App Design System](https://www.figma.com/design/TGPclDtmNDOvL2fdM0C0ML/Foodie-App-Design-System?node-id=1-52&p=f&t=8akwPNanhqgu6YUf-0)  
**Foodie-web** https://foodie-collect.vercel.app/  
**Foodie-docs** https://foodie-docs.vercel.app/?path=/story/foundations-overview--overview  

## Tech stack

- [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/) workspaces
- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/) driven entirely by generated design tokens
- [Style Dictionary](https://amzn.github.io/style-dictionary/) for the Figma → token pipeline
- [Storybook 10](https://storybook.js.org/) for component documentation + accessibility checks
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) + [jest-axe](https://github.com/nickcolley/jest-axe) for unit/accessibility tests
- [Playwright](https://playwright.dev/) + [pixelmatch](https://github.com/mapbox/pixelmatch) for visual regression
- TypeScript throughout

## Project structure

```
apps/
  foodie-web/     Next.js app — the actual product
  docs/           Storybook — component library docs, a11y checks, visual regression
packages/
  tokens/         @foodie/tokens — Style Dictionary pipeline, Figma-sourced design tokens
  ui/             @foodie/ui — the shared component library
  config/         @foodie/config — shared tsconfig/tailwind/eslint presets
```

## Getting started

**Prerequisites:** Node.js ≥20, [pnpm](https://pnpm.io/installation) (pinned via `packageManager` — `corepack enable` will pick up the right version automatically).

```bash
pnpm install
pnpm build      # builds tokens -> ui -> the app/docs, in dependency order
pnpm --filter foodie-web run dev   # http://localhost:3000
pnpm storybook                     # http://localhost:6006
```

## Scripts

Run from the repo root (each fans out to every workspace package via Turborepo):

| Command | What it does |
| --- | --- |
| `pnpm build` | Build every package/app, in dependency order |
| `pnpm dev` | Run dev servers for everything (`foodie-web` on 3000) |
| `pnpm lint` | Lint every package |
| `pnpm typecheck` | Typecheck every package |
| `pnpm test` | Run unit + accessibility tests (`@foodie/ui`, via Vitest) |
| `pnpm storybook` | Start the Storybook dev server |
| `pnpm test:visual` | Diff every Storybook story against committed baselines |
| `pnpm test:visual:update` | Regenerate visual regression baselines |

Scope any command to a single package with `--filter`, e.g.
`pnpm --filter @foodie/ui run test`.

## Design tokens

`packages/tokens/tokens/*.json` (primitive colors, semantic aliases,
typography, spacing, radius, shadow) are the single source of truth for
every visual value used across `@foodie/ui` and the app — Tailwind classes
reference tokens (`bg-brand-primary`, `p-md`, `rounded-lg`), never raw
hex/px values. Regenerate the CSS vars / TS constants / Tailwind theme with:

```bash
pnpm --filter @foodie/tokens run tokens:build
```

This also runs automatically before `lint`/`typecheck` so a fresh clone
never breaks on stale generated files.

## Testing & quality

- **Unit + accessibility**: `pnpm test` runs Vitest + React Testing Library
  for every `@foodie/ui` component, plus automated `jest-axe` checks.
- **Visual regression**: `pnpm test:visual` screenshots every Storybook
  story with Playwright and diffs it against a committed baseline PNG (see
  `apps/docs/visual-regression/README.md`).
- **Full verification before shipping a change**: clean install → build →
  typecheck → lint → test, across every affected package.

## Deployment

Both apps deploy to [Vercel](https://vercel.com) as separate projects from
this repo (Hobby/free tier):

| Project | Root Directory | Framework preset |
| --- | --- | --- |
| `foodie-web` | `apps/foodie-web` | Next.js |
| `docs` | `apps/docs` | Other |

Each app's `vercel.json` handles the monorepo-aware install/build commands
(building `@foodie/tokens` → `@foodie/ui` before the app itself) — no
manual dashboard configuration needed beyond setting the Root Directory.
