import { createFileRoute } from "@tanstack/react-router";
import { CornerDownRight } from "lucide-react";

export const Route = createFileRoute("/experience")({
	component: RouteComponent,
});

const timeline = [
	{
		period: "2023 — Present",
		title: "Full-Stack Developer",
		company: "Plainly Videos",
		active: true,
		points: [
			"Build and ship features across the React/TypeScript frontend and Node backend.",
			"Own video-templating and rendering workflows end to end.",
			"Review PRs and mentor on frontend architecture.",
		],
	},
	{
		period: "2021 — 2023",
		title: "Software Developer",
		company: "Previous Company",
		active: false,
		points: [
			"Delivered customer-facing web apps with React and REST APIs.",
			"Migrated legacy pages to a typed, component-driven codebase.",
		],
	},
	{
		period: "2020 — 2021",
		title: "Junior Developer",
		company: "First Company",
		active: false,
		points: [
			"Implemented UI features and fixed bugs across the stack.",
			"Wrote tests and learned production workflows.",
		],
	},
];

function RouteComponent() {
	return (
		<div className="bg-muted/10 flex-1 p-4 md:p-8 flex flex-col gap-6">
			<div className="border border-divider p-4 rounded-sm space-y-6">
				<h2 className="text-accent">CAREER TIMELINE</h2>
				<ul>
					{timeline.map((item, i) => {
						const isLast = i === timeline.length - 1;
						return (
							<li
								key={`${item.company}-${item.period}`}
								className="grid grid-cols-[5.5rem_1.25rem_1fr] gap-x-3 sm:grid-cols-[7rem_1.5rem_1fr] sm:gap-x-4"
							>
								{/* years */}
								<p className="pt-px text-left text-xs text-subtle">
									{item.period}
								</p>

								{/* timeline line + dot */}
								<div className="relative flex justify-center">
									{!isLast && (
										<span className="absolute left-1/2 top-2 bottom-0 w-px -translate-x-1/2 bg-divider" />
									)}
									<span className="relative mt-1 flex size-2">
										{item.active && (
											<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
										)}
										<span className="relative inline-flex size-2 rounded-full bg-accent" />
									</span>
								</div>

								{/* role + details */}
								<div className={isLast ? "" : "pb-8"}>
									<p className="text-sm">
										<span className="text-accent">{item.title}</span>{" "}
										<span className="text-muted">@</span>{" "}
										<span className="text-host">{item.company}</span>
									</p>
									<ul className="mt-2 space-y-1 text-xs text-white">
										{item.points.map((point) => (
											<li key={point} className="flex gap-2">
												<CornerDownRight className="mt-0.5 size-3 shrink-0 text-accent-border" />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
