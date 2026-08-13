# vladimir-aleksic

Personal portfolio, built as a code editor: file tree on the left, tabs over the
content, vim-style status bar, and a terminal you can type in. Each "file" in the
sidebar is a route.

## Stack

TanStack Start (SSR) · TanStack Router · React 19 · Tailwind CSS v4 · Biome ·
Vitest · Cloudflare Workers.

## Development

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

## Checks

```bash
pnpm test        # vitest run
pnpm check       # biome lint + format check
pnpm typecheck   # tsc --noEmit
pnpm build       # production build
```

CI runs all four on every push to `master` and every pull request.

## Deploy

```bash
pnpm deploy      # build + wrangler deploy
```

## Regenerating assets

Icons — `public/favicon.svg` is the source, everything else is derived:

```bash
node scripts/icons.mjs
```

CV — `public/cv.html` is the source, `public/cv.pdf` is generated from it:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 \
  --print-to-pdf=public/cv.pdf \
  "file://$PWD/public/cv.html"
```
