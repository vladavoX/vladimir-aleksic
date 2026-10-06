import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FolderGit2, Mail } from "lucide-react";
import { absoluteUrl, canonical } from "#/site";

const TITLE = "Vladimir Aleksic — Full-Stack Engineer, frontend-focused";
const DESCRIPTION =
	"Full-stack engineer at Plainly in Novi Sad: I own the Plainly Videos dashboard and built PlainlyFlows from an empty repo to its launch.";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: TITLE },
			{ name: "description", content: DESCRIPTION },
			{ property: "og:title", content: TITLE },
			{ property: "og:description", content: DESCRIPTION },
			{ property: "og:url", content: absoluteUrl("/") },
		],
		links: [canonical("/")],
	}),
	component: Home,
});

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
	"I'm a full-stack engineer at Plainly, on a team small enough that most of the frontend is mine. Our platform, Plainly Videos, turns After Effects templates and your data into rendered video at scale — a few hundred thousand videos a month — and I look after the dashboard behind it: projects, template parameterization, render queues, billing. I also built PlainlyFlows, our newer product, from an empty repo to its launch in July 2026.",
	"The rest of my time goes to things that live in the open: the After Effects plugin that pushes projects straight to Plainly, an MCP server so AI agents can drive our render API, a hot-reload tool I wrote because reopening a CEP panel on every save gets old, and willitspam.com, which I shipped solo. When a dependency is the thing that's broken, I'd rather fix it upstream than patch around it.",
	"I like tests and CI that actually catch things — Vitest and Playwright in Actions, Biome and oxlint on everything, types shared across repos so nothing quietly drifts. Claude Code is part of that loop now: I write its rules, read what it produces, and keep adding checks so it can verify its own work. Based in Novi Sad, Serbia, and open to new work.",
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
		<div className="bg-surface flex-1 *:mx-auto *:w-full *:max-w-5xl p-4 md:p-8 flex flex-col gap-6">
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
					<p key={text} className="text-sm leading-relaxed max-w-[72ch]">
						{text}
					</p>
				))}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Link
					to="/contact"
					className="inline-flex items-center gap-2 rounded-sm border border-accent-border bg-accent/10 px-3 py-2 text-accent transition-[background-color,scale] duration-150 ease-out-strong hover:bg-accent/20 active:scale-[0.97]"
				>
					<Mail className="size-3.5" />
					open contact.md
					<ArrowRight className="size-3.5" />
				</Link>
				<Link
					to="/projects"
					className="inline-flex items-center gap-2 rounded-sm border border-divider px-3 py-2 text-subtle transition-[color,border-color,scale] duration-150 ease-out-strong hover:border-accent-border hover:text-accent active:scale-[0.97]"
				>
					<FolderGit2 className="size-3.5" />
					projects.md
				</Link>
			</div>
			<div className="space-y-3 pt-2">
				<h2 className="text-accent">
					<span aria-hidden="true" className="text-muted">
						##{" "}
					</span>
					BY THE NUMBERS
				</h2>
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
							<p className="text-xs text-accent-dim">{stat.caption}</p>
						</div>
					))}
				</div>
			</div>
			<div className="space-y-3 pt-2">
				<h2 className="text-accent">
					<span aria-hidden="true" className="text-muted">
						##{" "}
					</span>
					QUICK STATS
				</h2>
				<div className="grid lg:grid-cols-2 gap-2">
					{quickStats.map((stat) => (
						<div
							key={stat.label}
							className="p-4 bg-black rounded-sm border border-divider flex flex-col gap-2"
						>
							<p className="text-xs text-accent-dim">{stat.label}</p>
							<p className="">{stat.value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
