# Portfolio improvements — design

Date: 2026-08-10

Five independent workstreams, one pull request each. They are separable: no
piece depends on another's runtime behaviour, only on merge order where two
touch the same file.

## Established facts

These were verified before design, not assumed.

- The GitHub repo `vladavoX/vladimir-aleksic` is **private**
  (`gh api repos/vladavoX/vladimir-aleksic --jq .private` → `true`). The
  unauthenticated GitHub API returns 404 for it, so a live CI status fetch
  cannot succeed today, and a token must never reach the browser.
- The Cloudflare account subdomain is `vladavox.workers.dev` — DNS resolves and
  Cloudflare answers there. `vladimir-aleksic.vladavox.workers.dev` currently
  returns HTTP 404 (error 1042), so the Worker is not serving on that hostname
  yet. The canonical URL becomes correct once `pnpm deploy` runs with the
  workers.dev route enabled.
- The footer branch indicator is **already** the real branch:
  `gitBranch()` in `vite.config.ts` resolves `CF_PAGES_BRANCH` /
  `WORKERS_CI_BRANCH`, then local git, then falls back to `"main"`, and is baked
  in through `define` as `__GIT_BRANCH__`. No work needed.
- `public/logo512.png`, `public/logo192.png` and `public/favicon.ico` are the
  **React logo** from the create-tanstack-app scaffold. Every icon surface —
  browser tab, apple-touch-icon, PWA manifest — currently shows React's mark.
- Neither ImageMagick nor sharp is installed. Headless Chrome, `sips`, `node`
  and `python3` are. Icon generation must work with those.

## PR 1 — Terminal keyboard shortcuts

The terminal panel can only be toggled by clicking its header
(`src/components/terminal.tsx`). Add keyboard control matching VS Code.

New `src/keybindings.ts` exports a pure
`matchShortcut({ ctrlKey, metaKey, altKey, code, key })` returning
`"toggle" | "clear" | "close" | null`. Pure so it is unit-tested without a DOM,
the pattern `src/terminal-commands.ts` already establishes. `terminal.tsx` adds
a single `window` `keydown` listener that dispatches on the result.

| Keys                    | Action                                              |
| ----------------------- | --------------------------------------------------- |
| `Ctrl+\``               | toggle panel; on open, focus input and scroll to end |
| `Cmd+J` / `Ctrl+J`      | same toggle (VS Code panel binding)                 |
| `Esc` inside terminal   | collapse, move focus to the TERMINAL button         |
| `Ctrl+L` in the input   | clear, through the existing `clear` effect          |

Requirements:

- Match on `event.code === "Backquote"`, not `event.key`, so non-US layouts
  work.
- `preventDefault()` on every handled combination; `Ctrl+L` otherwise focuses
  the browser address bar.
- `Esc` must move focus to the toggle button before collapsing. The panel is
  `inert` when closed, and focus left inside an inert subtree is an
  accessibility defect.
- Discoverability: render a `⌃\`` hint chip on the TERMINAL bar, `hidden
  sm:inline` so it does not appear on touch devices.
- Update the README terminal section.

## PR 2 — Icon and Open Graph asset set

Replace every scaffold icon with a VA monogram: green `oklch(64% 0.15 151)` on
black.

`public/favicon.svg` is hand-authored with the letterforms as **paths**, not
`<text>`. An SVG favicon naming a font renders in whatever the viewer's OS
substitutes, which is not a design.

`scripts/icons.mjs` renders that SVG at 16, 32, 48, 180, 192 and 512 px with
headless Chrome `--screenshot`, then packs the 16/32/48 PNGs into
`public/favicon.ico` with a small hand-rolled ICO writer. No new dependencies —
PNG-payload ICO files are read by every browser that matters.

Outputs:

- `favicon.svg`, `favicon.ico`
- `apple-touch-icon.png` at 180 px on an opaque black background — iOS
  composites transparency against white.
- `icon-192.png`, `icon-512.png`
- `icon-maskable-512.png` with 20 % safe-area padding, declared
  `purpose: "maskable"` while the plain icons stay `purpose: "any"`.
- `og.png` at 1200×630 from `scripts/og.html`: the mark, name, role, location.

Deletes `logo192.png` and `logo512.png`. Rewrites `public/manifest.json` and
the `links` array in `src/routes/__root.tsx`. README gains a regeneration
section mirroring the existing CV one.

## PR 3 — SEO

All five routes currently share one title and one description, and no route
defines `head()`.

- `src/site.ts` exports `SITE_URL` as a constant
  (`https://vladimir-aleksic.vladavox.workers.dev`). Delete the
  `VITE_SITE_URL` env indirection, its declaration in `src/vite-env.d.ts` and
  its README section. As it stands, an unset variable silently drops the Open
  Graph image in production, which is the failure mode the env var was meant to
  prevent.
- `head()` on each of the five routes: unique `title` and `description`, plus
  `og:title`, `og:description`, `og:url` and `rel=canonical` for that path.
- Root additionally emits `twitter:card: summary_large_image`, `og:image`
  pointing at `/og.png` with `og:image:width`, `og:image:height`,
  `og:image:alt`, and `meta name="author"`.
- JSON-LD `Person` + `ProfilePage` in the root head: name, `jobTitle`, `url`,
  `sameAs` for GitHub and LinkedIn, address Novi Sad RS, `knowsAbout` derived
  from `src/data/skills.json`.
- `public/sitemap.xml` listing the five routes and `/cv.html`, with a vitest
  asserting every route in `src/files.tsx` appears in it. The test is the drift
  guard; a static file alone rots.
- `public/robots.txt` gains a `Sitemap:` line.
- Fonts: `src/styles.css:1` imports JetBrains Mono from Google Fonts inside
  CSS, which blocks rendering on a third-party round trip with no `preconnect`.
  Replace with a self-hosted latin `woff2` under `public/fonts/`, an
  `@font-face` rule with `font-display: swap`, and `rel=preload`. JetBrains
  Mono is OFL-1.1, so ship `OFL.txt` next to the font file.
- `/skills` renders no heading of any kind. Add an `h1`.

## PR 4 — Polish

- **CI badge.** `src/components/footer.tsx` prints `CI passing` as a string
  regardless of reality. Replace with three states: unknown → the label `CI`
  as a plain link to the Actions page, asserting nothing; passing → green
  check; failing → red. Status comes from an unauthenticated fetch of the
  public Actions API on mount, failing soft. Against today's private repo that
  fetch 404s and the badge stays in its unknown state, which is the honest
  rendering. It starts working on its own if the repo becomes public. No
  credential is ever sent from the client.
- **404 status.** The not-found route serves HTTP 200. `notFoundComponent` does
  not set a status by itself. Spike how TanStack Start sets it; if there is no
  clean mechanism, leave the code alone and say so in the PR body rather than
  forcing it.
- **Response headers** on the Worker: `Referrer-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Permissions-Policy`. CSP is
  deferred or shipped report-only — TanStack Start injects inline scripts, so
  an enforcing policy needs nonce plumbing, which is separate work.
- **Terminal commands.** Add `cv`, which needs a new `open-url` effect and
  opens `/cv.pdf`, and `pwd`. `cat` and `history` are deliberately skipped.
  Update `COMMANDS`, the engine tests and the README.
- **Mobile terminal.** It opens expanded, taking 12 rem of a phone viewport.
  Collapse on mount below 640 px via `matchMedia`, after hydration, so the
  server markup is unchanged.

## PR 5 — Tab persistence

Open tabs are lost on refresh. `activeTabs` is a `useState<Set<string>>` in
`RootDocument` (`src/routes/__root.tsx`).

Persist to `localStorage` as an ordered array: a `Set` iterates in insertion
order, so an array round-trips the strip's left-to-right order.

- Initial state stays exactly as today. Reading storage inside `useState`
  initialisation would make the first client render disagree with the SSR HTML.
- A mount effect parses stored tabs, discards any route absent from
  `src/files.tsx`, unions the current pathname, and sets state. Dropping
  unknown routes stops a renamed route from resurrecting a dead tab.
- A second effect writes on change.
- Every storage access is wrapped in `try/catch`. Safari private mode throws on
  access, not only on write.
- Pure `parseTabs` / `serializeTabs` live in `src/tabs.ts` and are unit-tested
  without a DOM; the effects stay in `__root.tsx`.

Accepted cost: tabs appear one frame after hydration rather than in the server
HTML. Avoiding that needs a pre-hydration inline script, which works against
the CSP work in PR 4.

## Merge order

`__root.tsx` is touched by PRs 2, 3 and 5; `terminal.tsx` by PRs 1 and 4. The
edits are textually far apart, but merge in this order to keep conflicts
trivial:

1. PR 1 — terminal shortcuts
2. PR 2 — icons (PR 3 references `/og.png`)
3. PR 5 — tab persistence
4. PR 4 — polish (touches `terminal.tsx` after PR 1)
5. PR 3 — SEO (largest `__root.tsx` change, lands last)

## Verification

Every PR must pass what CI runs, from a clean install in its own worktree:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm check
pnpm build
```
