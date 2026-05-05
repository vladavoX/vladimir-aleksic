export function Header() {
	return (
		<header className="[grid-area:header] px-4 justify-between flex items-center border-b border-divider">
			<div className="flex items-center">
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
			<p className="text-host/70">
				vladimir<span className="text-muted">@</span>dev.local
			</p>
		</header>
	);
}
