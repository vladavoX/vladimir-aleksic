import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { Terminal } from "#/components/terminal";
import { fileName } from "#/files";

export function Main({
	children,
	activeTabs,
	setActiveTabs,
}: {
	children: React.ReactNode;
	activeTabs: Set<string>;
	setActiveTabs: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const navigate = useNavigate();

	const handleTabRemoval = (tab: string) => {
		setActiveTabs((prev) => {
			const newTabs = new Set(prev);
			newTabs.delete(tab);
			return newTabs;
		});

		if (pathname === tab) {
			const remainingTabs = [...activeTabs].filter((t) => t !== tab);
			if (remainingTabs.length > 0) {
				navigate({ to: remainingTabs[remainingTabs.length - 1] });
			} else {
				navigate({ to: "/" });
			}
		}
	};

	return (
		<div className="[grid-area:main] flex flex-col min-h-0 overflow-hidden">
			<div className="border-b border-divider shrink-0">
				<ul className="flex items-center overflow-auto">
					{[...activeTabs].map((tab) => (
						<li key={tab} className="h-8 flex items-center">
							<Link
								to={tab}
								activeProps={{ className: "border-accent bg-accent/10" }}
								inactiveProps={{
									className: "border-transparent hover:border-divider",
								}}
								className="h-full w-full py-2 px-4 border-b flex items-center justify-between"
							>
								{fileName(tab)}
								{activeTabs.size > 1 && (
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											handleTabRemoval(tab);
										}}
										className="ml-2 cursor-pointer text-muted hover:text-white/70 transition-colors"
									>
										<span className="sr-only">Close tab</span>
										<XIcon className="size-3" />
									</button>
								)}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className="py-2 px-4 flex items-center justify-between text-xs text-accent border-b border-divider shrink-0">
				<p className="flex items-center gap-2">
					<span className="text-subtle">~</span>
					<span className="text-muted">/portfolio/</span>
					{fileName(pathname) ?? <span className="text-prompt">404</span>}
				</p>
				<p className="text-muted">READ-ONLY</p>
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
				{children}
			</div>
			<Terminal />
		</div>
	);
}
