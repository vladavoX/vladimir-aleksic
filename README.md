# vladimir-aleksic

Personal portfolio built as a code editor: file tree on the left, tabs and a
breadcrumb over the content, vim-style status bar at the bottom, and a working
terminal you can actually type in.

Each "file" in the sidebar is a route:

| File             | Route         | What it is                                  |
| ---------------- | ------------- | ------------------------------------------- |
| `README.md`      | `/`           | Bio, by-the-numbers, quick stats            |
| `skills.json`    | `/skills`     | `src/data/skills.json` rendered as JSON     |
| `experience.log` | `/experience` | Career timeline with per-role tech stacks   |
| `contact.md`     | `/contact`    | Email, GitHub, LinkedIn, CV, current status |

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
pnpm test       # vitest run
pnpm check      # biome lint + format check
pnpm build      # production build (also what CI runs)
```

CI (`.github/workflows/ci.yml`) runs Biome, build and tests on every push to
`master` and every pull request.

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
- `src/files.tsx` — the file list. Add an entry and it appears in the sidebar,
  in tab handling, in `ls`, and in `cd`/`open` autocomplete.
- `src/routes/experience/route.tsx` — the timeline array.

The CV row on `/contact` links to `/cv.pdf`; drop the PDF at `public/cv.pdf` (or
remove that entry from `src/data/contact.ts`).

## Terminal

`src/terminal-commands.ts` is a pure command engine — input plus a context
(files, clock, identity, contact) in, output lines plus an optional effect
(`clear` / `navigate`) out — so it is unit-tested without a DOM. The React shell
in `src/components/terminal.tsx` owns history, Tab completion and scrolling.

Commands: `help`, `ls`, `cd` / `open`, `whoami`, `contact`, `echo`, `date`,
`clear`, `theme`. Tab completes commands and file arguments, ↑/↓ walks history.
