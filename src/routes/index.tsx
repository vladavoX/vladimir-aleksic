import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

const SHIPPING_SINCE = 2022;
const yearsShipping = new Date().getFullYear() - SHIPPING_SINCE;

const stats = [
	{
		label: "CONTRIBUTIONS / YR",
		value: "1900+",
		valueSuffix: "/ 2026",
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
	"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores pariatur labore quam nisi nobis earum numquam ipsam voluptates, delectus laudantium quibusdam doloribus cumque facere odit dolor consequatur similique, molestias et.",
	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, quod quis vitae quae beatae natus tenetur repellendus excepturi est accusamus delectus accusantium eligendi voluptatum, aut officia, maiores eveniet magni et.",
	"Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque voluptas labore aut facilis ratione debitis quae ullam suscipit ad quo atque, unde magni, optio accusamus, quasi in laboriosam a modi.",
];

const quickStats = [
	{
		label: "STACK",
		value: "TypeScript · React · Node",
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
		value: "Gaming",
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
					<p key={text.slice(0, 24)} className="text-sm xl:max-w-2/3">
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
