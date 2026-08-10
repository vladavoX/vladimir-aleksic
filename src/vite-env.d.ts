/// <reference types="vite/client" />

// Injected at build time by `define` in vite.config.ts (the git branch the
// bundle was built from).
declare const __GIT_BRANCH__: string;

interface ImportMetaEnv {
	/**
	 * Absolute origin the site is served from, e.g. "https://example.com".
	 * Set it to emit canonical and Open Graph URLs; left unset those tags are
	 * omitted rather than pointing somewhere wrong.
	 */
	readonly VITE_SITE_URL?: string;
}
