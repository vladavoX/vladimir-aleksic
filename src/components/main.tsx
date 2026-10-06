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
						// The tab chrome lives on the <li> so the close button can be a
						// sibling of the link — a <button> inside an <a> is invalid HTML
						// and both screen readers and keyboard focus trip over it.
						<li
							key={tab}
							className="flex h-8 shrink-0 items-center border-b border-transparent hover:border-divider has-[a[aria-current=page]]:border-accent has-[a[aria-current=page]]:bg-accent/10"
						>
							<Link
								to={tab}
								className={`flex h-full items-center pl-4 ${activeTabs.size > 1 ? "pr-1" : "pr-4"}`}
							>
								{fileName(tab)}
							</Link>
							{activeTabs.size > 1 && (
								<button
									type="button"
									onClick={() => handleTabRemoval(tab)}
									className="mr-2.5 cursor-pointer rounded-sm p-1 text-muted transition-colors hover:bg-white/5 hover:text-white/70"
								>
									<span className="sr-only">Close {fileName(tab)}</span>
									<XIcon className="size-3" />
								</button>
							)}
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
