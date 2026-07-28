# Visual regression

Screenshots every Storybook story with a real Chromium (Playwright) and
diffs it against a committed baseline PNG in `baselines/`. Catches visual
changes that unit tests and typecheck/lint can't — a component can pass
every assertion and still render with the wrong color, spacing, or size.

## Usage

```
pnpm build --filter @foodie/docs   # or: pnpm build (builds everything)
pnpm test:visual                   # diff against committed baselines
pnpm test:visual:update            # (re)write baselines from current render
```

Run `test:visual:update` and commit the result whenever a story's actual
appearance changes on purpose (new component, intentional restyle). Anyone
who runs `test:visual` afterward is now diffing against the new, correct
baseline.

## Status: baselines generated

`baselines/` has 21 committed PNGs, one per story across every component
stories file plus the Foundations overview page — generated via
`pnpm test:visual:update` on a machine with real network access (this
sandbox's outbound network blocks `playwright install`'s download from
`cdn.playwright.dev` with a 403, so it can't run the browser install or the
screenshot loop itself; the script's non-browser parts — story discovery,
static serving — were sanity-checked here regardless).

`pnpm test:visual` now diffs against real baselines. Re-run
`test:visual:update` and commit the result whenever a story's actual
appearance changes on purpose.
