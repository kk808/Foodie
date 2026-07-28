// Phase 7 — visual regression over every Storybook story.
//
// Serves the already-built `storybook-static` output (run `pnpm build`
// first — this script does not build Storybook itself, matching how
// `test`/`lint`/`typecheck` all depend on `^build` via turbo.json), screenshots
// each story's rendered root with a real Chromium via Playwright, and diffs
// it against a committed baseline PNG in `visual-regression/baselines/`.
//
// Why not `@storybook/test-runner`: it wraps this same
// Playwright-screenshot-and-diff idea in a Jest harness, but pinning a
// compatible version against Storybook 10.5 wasn't verified in this
// environment (outbound network is allowlisted here and blocked the
// Playwright browser download entirely — see the README in this folder).
// A ~150-line script with no additional test-runner-specific config is
// easier to keep in sync with a fast-moving Storybook major than a
// second test framework layered on top of vitest.
//
// Usage:
//   node visual-regression/run.mjs          # diff against committed baselines
//   node visual-regression/run.mjs --update # (re)write baselines from current render
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, "..", "storybook-static");
const BASELINE_DIR = path.join(__dirname, "baselines");
const DIFF_DIR = path.join(__dirname, "__diffs__");
const PORT = 6178;
const UPDATE = process.argv.includes("--update");

// Anything below this fraction of mismatched pixels is treated as noise
// (font antialiasing, subpixel rendering) rather than a real visual change.
const DIFF_THRESHOLD_RATIO = 0.001;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function serveStatic() {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split("?")[0]);
        const filePath = path.join(STATIC_DIR, urlPath === "/" ? "index.html" : urlPath);
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    server.listen(PORT, () => resolve(server));
    server.on("error", reject);
  });
}

async function main() {
  if (!existsSync(STATIC_DIR)) {
    console.error(`No build found at ${STATIC_DIR} — run \`pnpm build\` in apps/docs first.`);
    process.exit(1);
  }

  await mkdir(BASELINE_DIR, { recursive: true });
  await mkdir(DIFF_DIR, { recursive: true });

  const index = JSON.parse(await readFile(path.join(STATIC_DIR, "index.json"), "utf-8"));
  const stories = Object.values(index.entries).filter((e) => e.type === "story");

  const server = await serveStatic();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 500, height: 900 } });

  let created = 0;
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const story of stories) {
    const url = `http://localhost:${PORT}/iframe.html?id=${story.id}&viewMode=story`;
    await page.goto(url, { waitUntil: "networkidle" });
    const root = page.locator("#storybook-root");
    await root.waitFor({ state: "visible" });
    // Let fonts/layout settle — Storybook's own iframe has no animations,
    // but web font swap can shift text metrics right after paint.
    await page.waitForTimeout(150);

    const buffer = await root.screenshot();
    const baselinePath = path.join(BASELINE_DIR, `${story.id}.png`);

    if (UPDATE || !existsSync(baselinePath)) {
      await writeFile(baselinePath, buffer);
      created++;
      continue;
    }

    const current = PNG.sync.read(buffer);
    const baseline = PNG.sync.read(await readFile(baselinePath));

    if (current.width !== baseline.width || current.height !== baseline.height) {
      failed++;
      failures.push(`${story.id}: size changed (${baseline.width}x${baseline.height} -> ${current.width}x${current.height})`);
      await writeFile(path.join(DIFF_DIR, `${story.id}.png`), buffer);
      continue;
    }

    const diff = new PNG({ width: current.width, height: current.height });
    const mismatched = pixelmatch(
      current.data,
      baseline.data,
      diff.data,
      current.width,
      current.height,
      { threshold: 0.1 }
    );
    const ratio = mismatched / (current.width * current.height);

    if (ratio > DIFF_THRESHOLD_RATIO) {
      failed++;
      failures.push(`${story.id}: ${(ratio * 100).toFixed(2)}% of pixels differ`);
      await writeFile(path.join(DIFF_DIR, `${story.id}.png`), PNG.sync.write(diff));
    } else {
      passed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\n${stories.length} stories checked: ${passed} passed, ${failed} failed, ${created} new baseline(s) written.`);
  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  - ${f}`);
    console.log(`\nDiff images written to ${path.relative(process.cwd(), DIFF_DIR)}/`);
  }
  if (created > 0) {
    console.log(`\nNew baselines written to ${path.relative(process.cwd(), BASELINE_DIR)}/ — review and commit them.`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
