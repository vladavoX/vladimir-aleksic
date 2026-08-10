import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FolderGit2, Mail } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const SHIPPING_SINCE = 2022;
const yearsShipping = new Date().getFullYear() - SHIPPING_SINCE;

const stats = [
	{
		label: "VIDEOS RENDERED / MO",
		value: "300k+",
		valueSuffix: "/ Plainly Videos",
		caption: "the platform I build on",
	},
	{
		label: "YEARS SHIPPING",
		value: `${yearsShipping}+`,
		valueSuffix: `/ since ${SHIPPING_SINCE}`,
		caption: "full-stack, frontend-focused",
	},
	{
		label: "OSS REPOS",
		value: "4",
		valueSuffix: "/ maintained",
		caption: "plugin · MCP server · examples · CEP-reload",
	},
	{
		label: "COFFEE / DAY",
		value: "0",
		valueSuffix: "/ cups",
		caption: "runs on water",
	},
];

const chips = [
	{ label: "role", value: "full-stack" },
	{ label: "focus", value: "frontend" },
	{ label: "primary", value: "TypeScript" },
	{ label: "status", value: "open to work" },
];

const paragraphs = [
	"I'm a full-stack engineer at Plainly — seven people, three engineers — where I own most of the frontend. Our platform, Plainly Videos, renders around 300,000 videos a month for API and no-code customers, and I look after its dashboard: a React and TypeScript app covering projects, template parameterization, render queues and billing. I also took PlainlyFlows from an empty repo to launch in July 2026, and have shipped against real user feedback ever since, picking the next slice from what people actually do in the product.",
	"I build in the open. The Adobe ↔ Plainly After Effects plugin is mine end to end — a TypeScript CEP extension with outside issues and contributors, and signed releases shipped on tag. I work on our MCP server so AI agents can drive the render API directly, wrote CEP-reload because reopening a panel on every save is no way to live, shipped willitspam.com solo, and send fixes upstream to the tools we depend on.",
	"CI is what makes moving fast safe, not a tax: Vitest, Playwright and Cypress suites gated in GitHub Actions, Biome and oxlint enforced, types shared across repos through a Turborepo package so mismatches fail at the boundary. Claude Code is a daily driver — I write its rules, review what it produces, and add the checks that let it verify its own work. Based in Novi Sad, Serbia, open to new work.",
];

const quickStats = [
	{
		label: "STACK",
		value: "TypeScript · React · TanStack · Next.js",
	},
	{
		label: "QUALITY",
		value: "Vitest · Playwright · GitHub Actions",
	},
	{
		label: "EDITOR",
		value: "VSCode + Claude Code",
	},
	{
		label: "OFF-KEYBOARD",
		value: "Gaming, Motorcycling",
	},
];

function Home() {
	return (
		<div className="bg-muted/10 flex-1 p-4 md:p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">Vladimir Aleksic</h1>
				<p className="text-subtle text-sm">
					Full-Stack Engineer, frontend-focused · Novi Sad, RS
				</p>
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				{chips.map((chip) => (
					<p
						key={chip.label}
						className="rounded-sm border border-divider text-xs w-fit h-fit flex items-center"
					>
						<span className="px-2 py-1">{chip.label}</span>
						<span className="text-accent bg-accent/10 px-2 py-1">
							{chip.value}
						</span>
					</p>
				))}
			</div>
			<div className="space-y-2">
				{paragraphs.map((text) => (
					<p key={text} className="text-sm xl:max-w-2/3">
						{text}
					</p>
				))}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Link
					to="/contact"
					className="inline-flex items-center gap-2 rounded-sm border border-accent-border bg-accent/10 px-3 py-2 text-accent transition-colors hover:bg-accent/20"
				>
					<Mail className="size-3.5" />
					open contact.md
					<ArrowRight className="size-3.5" />
				</Link>
				<Link
					to="/projects"
					className="inline-flex items-center gap-2 rounded-sm border border-divider px-3 py-2 text-subtle transition-colors hover:border-accent-border hover:text-accent"
				>
					<FolderGit2 className="size-3.5" />
					projects.md
				</Link>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">BY THE NUMBERS</h2>
				<div className="grid lg:grid-cols-2 gap-2">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="p-4 bg-black rounded-sm border border-divider flex flex-col gap-2"
						>
							<p className="text-xs text-muted">{stat.label}</p>
							<p className="text-accent text-xl">
								{stat.value}
								<span className="text-subtle text-sm"> {stat.valueSuffix}</span>
							</p>
							<p className="text-xs text-accent-border">{stat.caption}</p>
						</div>
					))}
				</div>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">QUICK STATS</h2>
				<div className="grid lg:grid-cols-2 gap-2">
					{quickStats.map((stat) => (
						<div
							key={stat.label}
							className="p-4 bg-black rounded-sm border border-divider flex flex-col gap-2"
						>
							<p className="text-xs text-accent-border">{stat.label}</p>
							<p className="">{stat.value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
