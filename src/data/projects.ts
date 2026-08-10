export interface Project {
	name: string;
	href: string;
	/** Short label for what kind of thing this is. */
	kind: "maintained" | "upstream" | "tool" | "product";
	description: string;
	stack: string[];
}

export const projects: Project[] = [
	{
		name: "after-effects-plugin",
		href: "https://github.com/plainly-videos/after-effects-plugin",
		kind: "maintained",
		description:
			"Built solo and maintained in the open: a CEP extension that pushes After Effects projects straight to Plainly. External issues and contributors, issue and PR templates, signed release builds shipped on tag.",
		stack: ["TypeScript", "React", "CEP", "ExtendScript", "GitHub Actions"],
	},
	{
		name: "plainly-mcp",
		href: "https://github.com/plainly-videos",
		kind: "maintained",
		description:
			"MCP server that lets AI agents drive the render API directly. I set up its CI and tag-based releases, and reworked how it describes render parameters so agents call it correctly the first time.",
		stack: ["TypeScript", "MCP", "Node.js"],
	},
	{
		name: "willitspam.com",
		href: "https://willitspam.com",
		kind: "product",
		description:
			"Email spam-score checker, shipped solo in 2026. Server-rendered, deployed at the edge.",
		stack: ["TanStack Start", "React", "TypeScript", "SSR"],
	},
	{
		name: "CEP-reload",
		href: "https://github.com/vladavoX/CEP-reload",
		kind: "tool",
		description:
			"Dev tool that hot-reloads host-side JSX in CEP panels, so you stop reopening the panel on every save.",
		stack: ["Node.js", "JavaScript", "ExtendScript"],
	},
	{
		name: "nextra",
		href: "https://github.com/shuding/nextra/pulls?q=author%3AvladavoX",
		kind: "upstream",
		description:
			"Upstream PRs to the Next.js docs framework: exposing Pagefind index options, and fixing uninformative error output on malformed meta fields.",
		stack: ["TypeScript", "Next.js"],
	},
	{
		name: "filestack-react",
		href: "https://github.com/filestack/filestack-react/pull/160",
		kind: "upstream",
		description: "Upstream fix so the package resolves correctly under Vite.",
		stack: ["TypeScript", "Vite"],
	},
];
