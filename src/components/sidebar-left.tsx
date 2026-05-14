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
	isOpen,
	onClose,
}: {
	setActiveTabs: React.Dispatch<React.SetStateAction<Set<string>>>;
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<>
			<button
				type="button"
				aria-label="Close menu"
				onClick={onClose}
				data-open={isOpen || undefined}
				className="md:hidden fixed top-8.25 bottom-0 inset-x-0 z-40 bg-black/60 opacity-0 pointer-events-none transition-opacity duration-200 data-open:opacity-100 data-open:pointer-events-auto"
			/>
			<aside
				data-open={isOpen || undefined}
				className="[grid-area:sidebar] border-r border-divider bg-black fixed top-8.25 bottom-0 left-0 z-50 w-72 -translate-x-full transition-transform duration-200 data-open:translate-x-0 md:static md:w-auto md:translate-x-0"
			>
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
									onClick={() => {
										setActiveTabs((prev) => new Set(prev).add(file.to));
										onClose();
									}}
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
		</>
	);
}
