import { execSync } from "node:child_process";
import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Resolve the branch at build time: CI env var first (build host is often in
// detached HEAD), then local git, then a sane fallback. Baked into the bundle
// via `define` since the deployed Worker has no git at runtime.
function gitBranch() {
	const fromEnv = process.env.CF_PAGES_BRANCH || process.env.WORKERS_CI_BRANCH;
	if (fromEnv) return fromEnv;
	try {
		return execSync("git rev-parse --abbrev-ref HEAD", {
			encoding: "utf8",
		}).trim();
	} catch {
		return "main";
	}
}

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	define: {
		__GIT_BRANCH__: JSON.stringify(gitBranch()),
	},
	plugins: [
		devtools(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
});

export default config;
