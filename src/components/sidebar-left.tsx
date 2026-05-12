import { Link } from "@tanstack/react-router";
import { Braces, ChevronRight, Logs, Type } from "lucide-react";

const files = [
	{ icon: "M", name: "README.md", to: "/" },
	{ icon: <Type className="size-3.5" />, name: "now.txt", to: "/now" },
	{ icon: <Braces className="size-3.5" />, name: "skills.json", to: "/skills" },
	{
		icon: <Logs className="size-3.5" />,
		name: "experience.log",
		to: "/experience",
	},
];

export function SidebarLeft({
	setActiveTabs,
}: {
	setActiveTabs: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
	return (
		<aside className="[grid-area:sidebar] border-r border-divider">
			<div className="space-y-4 border-b border-divider p-4">
				<div className="flex items-start gap-4">
					<p className="text-accent border border-accent-border text-sm rounded-sm bg-accent/10 size-10 flex items-center justify-center">
						VA
					</p>
					<div>
						<p className="text-sm">Vladimir Aleksic</p>
						<p className="text-muted">Full-Stack Software Developer</p>
					</div>
				</div>
				<p className="flex items-center gap-2 text-subtle">
					<span className="relative flex size-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
						<span className="relative inline-flex size-2 rounded-full bg-accent" />
					</span>
					online · open to work
				</p>
			</div>
			<div className="py-4 text-muted">
				<ul className="text-sm">
					<li className="text-muted py-2 px-4">~/</li>
					{files.map((file) => (
						<li key={file.name}>
							<Link
								to={file.to}
								onClick={() =>
									setActiveTabs((prev) => new Set(prev).add(file.to))
								}
								activeProps={{
									className: "[&>*]:text-accent bg-accent/10 border-accent",
								}}
								inactiveProps={{
									className: "hover:bg-white/5 group border-transparent",
								}}
								className="flex items-center w-full h-full py-2 px-4 border-l"
							>
								<div className="w-4">
									<ChevronRight className="size-3" />
								</div>
								<span className="flex items-center justify-center w-6 text-mid mr-2">
									{file.icon}
								</span>
								<span className="text-subtle group-hover:text-white/70">
									{file.name}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}
