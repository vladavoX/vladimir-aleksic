import { configDefaults, defineConfig } from "vitest/config";

// Standalone test config: does NOT load the app's vite.config (the Cloudflare
// worker plugin is incompatible with Vitest). Only the `#/` path alias is
// reproduced here so test imports match the app.
export default defineConfig({
	resolve: {
		alias: [{ find: /^#\//, replacement: `${import.meta.dirname}/src/` }],
	},
	test: {
		environment: "node",
		// Git worktrees under .claude/ hold their own copy of src/, and the
		// default glob would collect their tests as if they were ours — then
		// resolve `#/` against this checkout, testing one branch's specs
		// against another branch's source. Spread the defaults; assigning
		// `exclude` replaces them rather than adding to them.
		exclude: [...configDefaults.exclude, "**/.claude/**"],
	},
});
