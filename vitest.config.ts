import { defineConfig } from "vitest/config";

// Standalone test config: does NOT load the app's vite.config (the Cloudflare
// worker plugin is incompatible with Vitest). Only the `#/` path alias is
// reproduced here so test imports match the app.
export default defineConfig({
	resolve: {
		alias: [{ find: /^#\//, replacement: `${import.meta.dirname}/src/` }],
	},
	test: {
		environment: "node",
	},
});
