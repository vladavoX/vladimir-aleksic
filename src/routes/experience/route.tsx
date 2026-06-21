import { createFileRoute } from "@tanstack/react-router";
import { CornerDownRight } from "lucide-react";

export const Route = createFileRoute("/experience")({
	component: RouteComponent,
});

const PLAINLY_GH = "https://github.com/plainly-videos";

function Repo({ name, children }: { name: string; children: React.ReactNode }) {
	return (
		<a
			href={`${PLAINLY_GH}/${name}`}
			target="_blank"
			rel="noreferrer"
			className="text-host underline-offset-2 hover:underline"
		>
			{children}
		</a>
	);
}

const timeline = [
	{
		period: "Nov 2023 — Present",
		title: "Full-Stack Developer",
		company: "Plainly",
		active: true,
		points: [
			{
				id: "langs",
				body: "Frontend, E2E and Node development in TypeScript / JavaScript, with some Java.",
			},
			{ id: "videos", body: "Working on the core product, Plainly Videos." },
			{ id: "flows", body: "Building the upcoming product, Plainly Flows." },
			{
				id: "oss",
				body: (
					<>
						Maintaining open source: the{" "}
						<Repo name="after-effects-plugin">After Effects plugin</Repo> (Adobe
						↔ Plainly integration) and the{" "}
						<Repo name="examples">REST API examples</Repo>.
					</>
				),
			},
		],
		stack: [
			"Next.js",
			"TanStack",
			"React",
			"TypeScript",
			"JavaScript",
			"shadcn/ui",
			"Tailwind CSS",
			"Node.js",
			"Spring Boot",
			"Java",
			"REST API",
			"Prisma",
			"PostgreSQL",
			"MongoDB",
			"Cypress",
			"Playwright",
			"Jest",
			"Docker",
			"GitHub Actions",
			"ExtendScript (Adobe)",
		],
	},
	{
		period: "Nov 2022 — Nov 2023",
		title: "Full-Stack Developer",
		company: "Positive Tech",
		active: false,
		points: [
			{
				id: "outsourcing",
				body: "Outsourcing — shipped a wide range of client projects.",
			},
			{
				id: "stack",
				body: "Frontend and backend work with JavaScript / TypeScript, React and Node.",
			},
		],
		stack: [
			"React",
			"React Native",
			"Next.js",
			"TypeScript",
			"JavaScript",
			"Node.js",
			"REST API",
			"WordPress",
			"Shopify",
		],
	},
	{
		period: "Oct 2022 — Nov 2022",
		title: "Full Stack JavaScript Developer",
		company: "Levi9 Technology Services · Internship",
		active: false,
		points: [
			{ id: "stack", body: "TypeScript, Node.js and JavaScript." },
			{
				id: "app",
				body: "Built an app where you and your manager set and track personal growth goals — new skills to learn and areas to improve on.",
			},
		],
		stack: ["TypeScript", "Node.js", "JavaScript", "REST API", "MySQL"],
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
								className="grid grid-cols-[9.5rem_1.25rem_1fr] gap-x-3 sm:grid-cols-[9.5rem_1.5rem_1fr] sm:gap-x-4"
							>
								{/* years */}
								<p className="pt-px text-left text-xs text-subtle whitespace-nowrap">
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
											<li key={point.id} className="flex gap-2">
												<CornerDownRight className="mt-0.5 size-3 shrink-0 text-accent-border" />
												<span>{point.body}</span>
											</li>
										))}
									</ul>
									<div className="mt-3 flex flex-wrap gap-1.5">
										{item.stack.map((tech) => (
											<span
												key={tech}
												className="rounded-sm border border-divider px-1.5 py-0.5 text-[10px] text-mid"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
