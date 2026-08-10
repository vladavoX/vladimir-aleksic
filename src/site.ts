/**
 * Public origin the site is served from, no trailing slash.
 *
 * Hard-coded rather than read from the environment: absolute URLs are the whole
 * point of canonical, Open Graph and JSON-LD tags, and a build var that nothing
 * sets ships a page with those tags silently missing. One deploy target, one
 * constant, wrong at review time instead of invisible in production.
 */
export const SITE_URL = "https://vladimir-aleksic.vladavox.workers.dev";

/**
 * Absolute URL for a route path or public asset, e.g. `/skills` or `/og.png`.
 * Paths keep their leading slash, so the site root is `.../` — the same string
 * the sitemap lists.
 */
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

/**
 * Canonical link tag for a path. Shared so the root and each route produce a
 * byte-identical tag — head links are concatenated across matches and only
 * deduplicated when identical, so a differing shape would emit two canonicals.
 */
export const canonical = (path: string) => ({
	rel: "canonical",
	href: absoluteUrl(path),
});
