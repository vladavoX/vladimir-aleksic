import { Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
	return (
		<header className="[grid-area:header] md:px-4 h-8.25 md:h-auto justify-between flex items-center border-b border-divider">
			<div className="flex md:hidden items-center w-full">
				<button
					type="button"
					onClick={onMenuClick}
					className="text-accent cursor-pointer px-4 py-2 active:bg-accent/10"
				>
					<span className="sr-only">Open menu</span>
					<Menu className="size-4 shrink-0" />
				</button>
			</div>
			<div className="hidden md:flex items-center">
				<p className="pr-2 text-muted">
					<span className="text-prompt/70">0:</span> portfolio
				</p>
				<p className="relative -mb-px border-x border-b border-divider border-b-black px-2 py-2 text-accent">
					<span className="text-prompt/70">1:</span> ~/portfolio*
				</p>
				<p className="pl-2 text-muted">
					<span className="text-prompt/70">2:</span> zsh
				</p>
			</div>
			<p className="hidden md:block text-host/70">
				vladimir<span className="text-muted">@</span>dev.local
			</p>
		</header>
	);
}
