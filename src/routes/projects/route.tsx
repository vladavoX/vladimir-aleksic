import { createFileRoute } from "@tanstack/react-router";
import { SquareArrowOutUpRight } from "lucide-react";
import { type Project, projects } from "#/data/projects";

export const Route = createFileRoute("/projects")({
	component: RouteComponent,
});

const kindLabel: Record<Project["kind"], string> = {
	maintained: "maintained",
	tool: "dev tool",
	product: "side product",
};

const kindClass: Record<Project["kind"], string> = {
	maintained: "border-accent-border text-accent bg-accent/10",
	tool: "border-divider text-mid",
	product: "border-divider text-prompt/80",
};

function ProjectCard({ project }: { project: Project }) {
	return (
		<li className="rounded-sm border border-divider bg-black p-4 space-y-3">
			<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
				<a
					href={project.href}
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-1.5 text-sm text-host underline-offset-2 hover:underline"
				>
					{project.name}
					<SquareArrowOutUpRight className="size-3 shrink-0 text-muted" />
				</a>
				<span
					className={`rounded-sm border px-1.5 py-0.5 text-[10px] ${kindClass[project.kind]}`}
				>
					{kindLabel[project.kind]}
				</span>
			</div>
			<p className="text-xs text-white xl:max-w-2/3">{project.description}</p>
			<div className="flex flex-wrap gap-1.5">
				{project.stack.map((tech) => (
					<span
						key={tech}
						className="rounded-sm border border-divider px-1.5 py-0.5 text-[10px] text-mid"
					>
						{tech}
					</span>
				))}
			</div>
		</li>
	);
}

function RouteComponent() {
	return (
		<div className="bg-muted/10 flex-1 p-4 md:p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">Things I build in the open</h1>
				<p className="text-subtle text-sm xl:max-w-2/3">
					Plugins and tooling I maintain, and side products I shipped solo.
				</p>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">OPEN SOURCE &amp; SIDE PROJECTS</h2>
				<ul className="space-y-2">
					{projects.map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</ul>
			</div>
		</div>
	);
}
