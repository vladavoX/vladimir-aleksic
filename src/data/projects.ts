export interface Project {
	name: string;
	href: string;
	/** Short label for what kind of thing this is. */
	kind: "maintained" | "tool" | "product";
	description: string;
	stack: string[];
}

export const projects: Project[] = [
	{
		name: "after-effects-plugin",
		href: "https://github.com/plainly-videos/after-effects-plugin",
		kind: "maintained",
		description:
			"A CEP extension that pushes After Effects projects straight to Plainly. Mine end to end — issues and PRs from outside, signed releases on tag.",
		stack: ["TypeScript", "React", "CEP", "ExtendScript", "GitHub Actions"],
	},
	{
		name: "mcp-server",
		href: "https://github.com/plainly-videos/mcp-server",
		kind: "maintained",
		description:
			"MCP server that lets AI agents drive the render API. I set up its CI and releases, and reworked how it describes render parameters so agents get the call right.",
		stack: ["TypeScript", "MCP", "Node.js"],
	},
	{
		name: "willitspam.com",
		href: "https://willitspam.com",
		kind: "product",
		description:
			"Email spam-score checker. Built and shipped solo in 2026, server-rendered at the edge.",
		stack: ["TanStack Start", "React", "TypeScript", "SSR"],
	},
	{
		name: "CEP-reload",
		href: "https://github.com/vladavoX/CEP-reload",
		kind: "tool",
		description:
			"Hot-reloads host-side JSX in CEP panels, because reopening the panel on every save gets old fast.",
		stack: ["Node.js", "JavaScript", "ExtendScript"],
	},
];
