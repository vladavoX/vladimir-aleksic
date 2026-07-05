import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

const SHIPPING_SINCE = 2022;
const yearsShipping = new Date().getFullYear() - SHIPPING_SINCE;

const stats = [
	{
		label: "CONTRIBUTIONS / YR",
		value: "2100+",
		valueSuffix: "/ past year",
		caption: "commits · PRs · reviews",
	},
	{
		label: "YEARS SHIPPING",
		value: `${yearsShipping}+`,
		valueSuffix: `/ since ${SHIPPING_SINCE}`,
		caption: "full-stack work",
	},
	{
		label: "LANGUAGES IN PROD",
		value: "3",
		valueSuffix: "/ daily",
		caption: "TypeScript · JavaScript · Java",
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
	{ label: "primary", value: "TypeScript" },
	{ label: "years", value: `${yearsShipping}` },
	{ label: "status", value: "accepting work" },
];

const paragraphs = [
	"I'm a full-stack developer at Plainly, where I build Plainly Videos — a video automation platform that turns Adobe After Effects templates and your data into rendered videos at scale — and help shape Plainly Flows, the product we're launching next. Day to day that's TypeScript across the frontend, Node services, and end-to-end tests, with some Java and Spring Boot on the backend.",
	"I've been shipping production software since 2022. I started with an internship at Levi9, spent a year at Positive Tech delivering client projects across the stack, and have been at Plainly since late 2023. Along the way I maintain our open source — the Adobe ↔ Plainly After Effects plugin and the public REST API examples.",
	"I care about clean, well-tested code and tools that get out of the way. React, TanStack, and Node are my daily drivers. Based in Novi Sad, Serbia — open to new work.",
];

const quickStats = [
	{
		label: "STACK",
		value: "TypeScript · React · Next.js",
	},
	{
		label: "EDITOR",
		value: "VSCode",
	},
	{
		label: "LEARNING NEXT",
		value: "Rust / Zig",
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
					Full-Stack Software Developer · Novi Sad, RS
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
