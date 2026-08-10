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

function Code({ children }: { children: React.ReactNode }) {
	return <code className="text-host">{children}</code>;
}

const timeline = [
	{
		period: "Nov 2023 — Present",
		title: "Full-Stack Engineer · frontend-focused",
		company: "Plainly",
		active: true,
		context:
			"Video automation, remote, seven people and three engineers. The platform, Plainly Videos, renders around 300,000 videos a month for API and no-code customers.",
		points: [
			{
				id: "flows",
				body: "Built PlainlyFlows 0→1 — a new product dashboard from empty repo to launch in July 2026. Since launch I ship directly against user feedback, deciding the next slice from what people do in the product rather than from a spec.",
			},
			{
				id: "dashboard",
				body: "Own the Plainly Videos dashboard — a React and TypeScript app covering projects, template parameterization, render queues and billing, used daily by customers automating video at scale.",
			},
			{
				id: "plugin",
				body: (
					<>
						Built the{" "}
						<Repo name="after-effects-plugin">After Effects plugin</Repo> solo
						and maintain it in the open — a TypeScript CEP extension that pushes
						projects straight to Plainly, with outside issues and contributors,
						issue and PR templates, and signed release builds shipped on tag.
					</>
				),
			},
			{
				id: "mcp",
				body: "Work on the Plainly MCP server, which lets AI agents drive the render API directly — set up its CI and tag-based releases, and reworked how it describes render parameters so agents call it correctly first time.",
			},
			{
				id: "quality",
				body: "Own the quality gates: Vitest and Playwright / Cypress suites gated in GitHub Actions, lint and format enforced by Biome and oxlint, frozen lockfiles, and continuous dependency security triage across four repos.",
			},
			{
				id: "monorepo",
				body: (
					<>
						Converted the plugin to a Turborepo monorepo and extracted a shared{" "}
						<Code>plainly-types</Code> package, so types are enforced at the
						boundary between the plugin, the{" "}
						<Repo name="examples">REST API examples</Repo> and our API.
					</>
				),
			},
			{
				id: "regression",
				body: "After a regression in how render parameters are built from user input reached production, I wrote the test suite around that logic — changes near it now fail loudly instead of breaking it quietly.",
			},
			{
				id: "perf",
				body: (
					<>
						Frontend performance: manual chunk splitting and route-level lazy
						loading against Vite bundle analysis, plus refactors cutting
						unnecessary <Code>useEffect</Code> and re-render churn.
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
			"MCP",
			"Prisma",
			"PostgreSQL",
			"MongoDB",
			"Vitest",
			"Cypress",
			"Playwright",
			"Jest",
			"Turborepo",
			"Biome",
			"oxlint",
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
		context: "Software outsourcing, Novi Sad.",
		points: [
			{
				id: "clients",
				body: "Delivered client projects across the JavaScript and TypeScript stack — mostly React frontends shipped to external clients on their deadlines.",
			},
			{
				id: "stack",
				body: "Frontend and backend work with React, React Native and Node, plus WordPress and Shopify builds where the client already lived there.",
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
		company: "Levi9 Technology Services",
		active: false,
		context: "Internship, Novi Sad.",
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
								className="grid grid-cols-[1.25rem_1fr] gap-x-3 lg:grid-cols-[9.5rem_1.5rem_1fr] lg:gap-x-4"
							>
								{/* years (left column on sm+) */}
								<p className="hidden pt-px text-left text-xs text-subtle whitespace-nowrap lg:block">
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
									{/* date label (mobile only — years column is hidden) */}
									<p className="mb-1 text-xs text-subtle lg:hidden">
										{item.period}
									</p>
									<p className="text-sm">
										<span className="text-accent">{item.title}</span>{" "}
										<span className="text-muted">@</span>{" "}
										<span className="text-host">{item.company}</span>
									</p>
									<p className="mt-1 text-xs text-subtle xl:max-w-2/3">
										{item.context}
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
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">EDUCATION</h2>
				<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-sm border border-divider bg-black p-4">
					<p className="text-sm">
						<span className="text-accent">
							BSc, Computer Software Engineering
						</span>{" "}
						<span className="text-muted">@</span>{" "}
						<span className="text-host">Singidunum University</span>
					</p>
					<p className="text-xs text-subtle">2026</p>
				</div>
			</div>
		</div>
	);
}
