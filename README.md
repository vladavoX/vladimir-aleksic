# vladimir-aleksic

Personal portfolio built as a code editor: file tree on the left, tabs and a
breadcrumb over the content, vim-style status bar at the bottom, and a working
terminal you can actually type in.

Each "file" in the sidebar is a route:

| File             | Route         | What it is                                    |
| ---------------- | ------------- | --------------------------------------------- |
| `README.md`      | `/`           | Bio, by-the-numbers, quick stats              |
| `skills.json`    | `/skills`     | `src/data/skills.json` rendered as JSON       |
| `experience.log` | `/experience` | Career timeline with per-role stacks, plus education |
| `projects.md`    | `/projects`   | Open source maintained, upstream PRs, side products |
| `contact.md`     | `/contact`    | Email, GitHub, LinkedIn, CV, current status   |

## Stack

TanStack Start (SSR) · TanStack Router (file-based routes) · React 19 with the
React Compiler · Tailwind CSS v4 · Biome · Vitest · deployed to Cloudflare
Workers via Wrangler.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Checks

```bash
pnpm test        # vitest run
pnpm check       # biome lint + format check
pnpm typecheck   # tsc --noEmit
pnpm build       # production build
```

CI (`.github/workflows/ci.yml`) runs all four on every push to `master` and
every pull request. The build itself does not typecheck, which is why
`typecheck` is its own step.

## Deploy

```bash
pnpm deploy     # build + wrangler deploy
```

The Worker is named `vladimir-aleksic` in `wrangler.jsonc`. The footer's branch
indicator is baked in at build time from `CF_PAGES_BRANCH` / `WORKERS_CI_BRANCH`
or local git — see `gitBranch()` in `vite.config.ts`.

### `VITE_SITE_URL`

Optional, build-time. Set it to the deploy origin (e.g.
`https://vladimiraleksic.dev`) and the root route emits an absolute Open Graph
image URL. Left unset, the tag is omitted rather than pointing at the wrong
host.

## Content

Everything editable lives in data modules, not in JSX:

- `src/data/skills.json` — the `/skills` view; nested objects and arrays render
  automatically.
- `src/data/contact.ts` — contact rows, location, timezone, availability. Shared
  by the `/contact` route and the terminal's `contact` command.
- `src/data/projects.ts` — the `/projects` cards; `kind` picks the badge colour.
- `src/files.tsx` — the file list. Add an entry and it appears in the sidebar,
  in tab handling, in `ls`, and in `cd`/`open` autocomplete.
- `src/routes/experience/route.tsx` — the timeline array.

## CV

`public/cv.html` is the CV source — a single self-contained A4 page, print styles
included. `public/cv.pdf` is generated from it, and is what the CV row on
`/contact` links to. Edit the HTML, then regenerate:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 \
  --print-to-pdf=public/cv.pdf \
  "file://$PWD/public/cv.html"
```

Any headless Chromium works; `Cmd-P → Save as PDF` from the browser also does,
with margins set to none. Both files are served, so `/cv.html` is a readable web
version if you ever want to link that instead.

## Icons

`public/favicon.svg` is the source of truth — a hand-drawn VA monogram, green on
black, letterforms as paths so no font substitution can happen. Everything else
in the set is generated from it. Edit the SVG, then regenerate:

```bash
node scripts/icons.mjs
```

That writes `public/favicon.ico` (16 + 32 + 48), `apple-touch-icon.png` (180,
opaque — iOS composites transparency against white), `icon-192.png`,
`icon-512.png`, `icon-maskable-512.png` (the mark inside Android's ~20% safe
area) and `og.png` (1200×630, from `scripts/og.html`).

There is no ImageMagick and no sharp in this repo, so the script rasterises with
headless Chrome and writes the `.ico` container itself — three PNG payloads
behind an `ICONDIR`, which is what browsers actually read. Chrome is expected at
the usual macOS path; set `CHROME` to point elsewhere. Editing
`scripts/og.html`? It loads the monogram from `public/favicon.svg` and JetBrains
Mono from Google Fonts, so open it in a browser to preview before regenerating.

## Terminal

`src/terminal-commands.ts` is a pure command engine — input plus a context
(files, clock, identity, contact) in, output lines plus an optional effect
(`clear` / `navigate`) out — so it is unit-tested without a DOM. The React shell
in `src/components/terminal.tsx` owns history, Tab completion and scrolling.

Commands: `help`, `ls`, `cd` / `open`, `whoami`, `contact`, `echo`, `date`,
`clear`, `theme`. Tab completes commands and file arguments, ↑/↓ walks history.
