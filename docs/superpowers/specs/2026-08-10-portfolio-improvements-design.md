# Portfolio improvements — design

Date: 2026-08-10

Five independent workstreams, one pull request each. They are separable with one
exception: PR 3 references `/og.png`, which PR 2 produces, and PR 2 removes
`logo512.png`, which the root route's `og:image` currently points at. That is a
real artefact dependency, not just a merge-order conflict — see "Merge order"
for how it is sequenced. Everything else is independent at runtime.

## Established facts

These were verified before design, not assumed.

- The GitHub repo `vladavoX/vladimir-aleksic` is **private**
  (`gh api repos/vladavoX/vladimir-aleksic --jq .private` → `true`). The
  unauthenticated GitHub API returns 404 for it, so a live CI status fetch
  cannot succeed today, and a token must never reach the browser.
- The Cloudflare account subdomain is `vladavox.workers.dev` — DNS resolves and
  Cloudflare answers there. `vladimir-aleksic.vladavox.workers.dev` currently
  returns HTTP 404 (error 1042), so the Worker is not serving on that hostname
  yet. `wrangler.jsonc` declares no `workers_dev`, no `routes` and no custom
  domain, so nothing enables that hostname today — PR 3 must add
  `"workers_dev": true` to `wrangler.jsonc` and deploy, or the canonical URL it
  hardcodes stays dead.
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
`matchShortcut({ ctrlKey, metaKey, altKey, shiftKey, code, key })` returning
`"toggle" | "clear" | "close" | null`. Pure so it is unit-tested without a DOM,
the pattern `src/terminal-commands.ts` already establishes. `terminal.tsx` adds
a single `window` `keydown` listener that dispatches on the result.

`matchShortcut` sees only modifiers and the key, never focus, so it cannot
decide the two scoped bindings on its own. `"toggle"` is global; `"clear"` and
`"close"` are returned for the key combination and then gated in `terminal.tsx`
on the event target being inside the panel (`bodyRef.current?.contains(target)`,
or `target === inputRef.current` for `clear`). Without that gate a window-level
listener would swallow `Ctrl+L` — the browser's address-bar shortcut — anywhere
on the page, and `Esc` would collapse the terminal while the user is only trying
to dismiss the mobile sidebar.

`shiftKey` is part of the input and must be `false` for every binding: VS Code
uses `Ctrl+Shift+\`` for "new terminal", and ignoring Shift would silently fold
it, and `Cmd+Shift+J`, into the toggle.

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
- Discoverability: render a `Ctrl+\`` hint chip on the TERMINAL bar, `hidden
  sm:inline` so it does not appear on touch devices. Plain ASCII, not the Mac
  `⌃` glyph: U+2303 is outside the latin subset PR 3 self-hosts, so it would
  render in whatever fallback font the OS picks.
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
both head arrays in `src/routes/__root.tsx` — not just `links` (which holds the
`apple-touch-icon` pointing at `/logo192.png`) but also `meta`, where the
conditional `og:image` points at `${siteUrl}/logo512.png`. Missing that second
one leaves the Open Graph card resolving to a deleted file for the three merges
between PR 2 and PR 3; PR 2 repoints it at `/og.png` itself rather than deferring
to PR 3. README gains a regeneration section mirroring the existing CV one.

## PR 3 — SEO

All five routes currently share one title and one description, and no route
defines `head()`.

- `src/site.ts` exports `SITE_URL` as a constant
  (`https://vladimir-aleksic.vladavox.workers.dev`). Delete the
  `VITE_SITE_URL` env indirection, its declaration in `src/vite-env.d.ts` and
  its README section. As it stands, an unset variable silently drops the Open
  Graph image in production, which is the failure mode the env var was meant to
  prevent. Because the constant is now unconditional, enabling the hostname is
  part of this PR (`"workers_dev": true` in `wrangler.jsonc`): a `rel=canonical`
  and `og:url` pointing at a host that answers 404 is worse than omitting them —
  it de-indexes whatever host is actually serving.
- `head()` on each of the five routes: unique `title` and `description`, plus
  `og:title`, `og:description`, and absolute `og:url` / `rel=canonical`
  (`${SITE_URL}${path}`) for that path.
- Root additionally emits `twitter:card: summary_large_image`, `og:image` as the
  absolute `${SITE_URL}/og.png` — scrapers do not resolve root-relative image
  URLs, which is the whole reason the deleted code guarded on an origin — with
  `og:image:width`, `og:image:height`, `og:image:alt`, and
  `meta name="author"`.
- JSON-LD `Person` + `ProfilePage` in the root head: name, `jobTitle`, `url`,
  `sameAs` for GitHub and LinkedIn, address Novi Sad RS, `knowsAbout` derived
  from `src/data/skills.json`.
- `public/sitemap.xml` listing the five routes and `/cv.html`, with a vitest
  asserting the set of route `<loc>` values equals the set of routes in
  `src/files.tsx` — both directions, plus that every `<loc>` starts with
  `SITE_URL`. A one-directional "every route appears" assertion passes while a
  renamed route leaves its old `<loc>` in the file, and crawlers keep being
  handed a URL that 404s. The test is the drift guard; a static file alone rots.
- `public/robots.txt` gains a `Sitemap:` line.
- Fonts: `src/styles.css:1` imports JetBrains Mono from Google Fonts inside
  CSS, which blocks rendering on a third-party round trip with no `preconnect`.
  Replace with a self-hosted latin `woff2` under `public/fonts/`, an
  `@font-face` rule with `font-display: swap`, and `rel=preload`. JetBrains
  Mono is OFL-1.1, so ship `OFL.txt` next to the font file.
- `/skills` renders no heading of any kind, and `/experience` opens at `h2`
  (`CAREER TIMELINE`, `EDUCATION`) with no `h1` above them. Add an `h1` to both
  so all five routes have a single top-level heading.

## PR 4 — Polish

- **CI badge.** `src/components/footer.tsx` prints `CI passing` as a string
  regardless of reality. Replace with three states: unknown → the label `CI`
  as a plain link to the Actions page, asserting nothing; passing → green
  check; failing → red. Status comes from an unauthenticated fetch of the
  public Actions API on mount. "Failing soft" means branching on
  `response.ok` as well as catching rejections — a 404 from `api.github.com`
  resolves normally, so a bare `try/catch` around `res.json()` is not what keeps
  the badge in its unknown state. The effect also aborts on unmount
  (`AbortController`) so the `setState` cannot land after teardown. Against
  today's private repo that fetch 404s and the badge stays unknown, which is the
  honest rendering. It starts working on its own if the repo becomes public. No
  credential is ever sent from the client.
- **404 status.** ~~The not-found route serves HTTP 200.~~ **Wrong — this was
  never broken.** The design asserted a 200 without measuring it. An unknown
  path already answers `HTTP/1.1 404 Not Found` with the 404 page body, in both
  `pnpm dev` and `pnpm preview`, while `/` stays 200. `router-core`'s
  `applyFailure` returns `status: 404` for a not-found boundary and
  `renderRouterToStream` uses it. `setResponseStatus` does exist in the
  installed `@tanstack/start-server-core` but would have been the wrong tool
  anyway: h3's `prepareResponse` ignores `event.res.status` when the handler
  returns a `Response`, which SSR always does. No code change.
- **Response headers** on the Worker: `Referrer-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Permissions-Policy`. Set in the
  server request handler, not a `public/_headers` file: with Workers static
  assets `_headers` decorates asset responses, while the HTML document is
  generated by the Worker — and the document is the only response where
  `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` do anything. CSP
  is deferred or shipped report-only — TanStack Start injects inline scripts, so
  an enforcing policy needs nonce plumbing, which is separate work.
- **Terminal commands.** Add `cv`, which needs a new `open-url` effect and
  opens `/cv.pdf`, and `pwd`. `cat` and `history` are deliberately skipped.
  Update `COMMANDS`, the `Effect` union, the `effect` dispatch in
  `terminal.tsx`'s `submit` (which today only branches on `clear` and
  `navigate`, so an unhandled variant is a silent no-op), the engine tests and
  the README.
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
  `src/files.tsx`, and sets state. Dropping unknown routes stops a renamed route
  from resurrecting a dead tab.
- The current pathname is unioned in **only when it is itself a route in
  `src/files.tsx`** — the same guard the existing initial state applies. Union it
  unconditionally and landing on `/nope` opens a tab whose `fileName(tab)` is
  `undefined`, i.e. a blank label in the strip, and then persists it; the
  existing comment in `__root.tsx` exists precisely to prevent that. Restoring an
  empty or unparseable value falls back to today's initial state rather than an
  empty strip.
- A second effect writes on change. It is declared *after* the restore effect, so
  the read happens before the first write can clobber storage with the
  pre-restore state.
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

Every PR must pass what CI runs, from a clean install in its own worktree. CI
invokes Biome through `biomejs/setup-biome` as `biome ci .` rather than the
`check` script, so run the local equivalent:

```bash
pnpm install --frozen-lockfile
pnpm exec biome ci .   # CI's Biome step; `pnpm check` locally
pnpm typecheck
pnpm build
pnpm test
```
