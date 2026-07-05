import { useLocation } from "@tanstack/react-router";
import { Check, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { fileName } from "#/files";

const FONT = "JetBrains Mono";

function useLocalClock() {
	// Empty on the server and the first client render so hydration matches;
	// filled in after mount and ticked every second from the browser's own
	// locale + timezone.
	const [now, setNow] = useState("");

	useEffect(() => {
		const tick = () =>
			setNow(
				new Date().toLocaleString(undefined, {
					weekday: "short",
					day: "2-digit",
					month: "short",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false,
				}),
			);
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	return now;
}

export function Footer() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const now = useLocalClock();

	const file = fileName(pathname);
	const cwd = file ? `~/portfolio/${file}` : "~/portfolio";

	return (
		<footer className="[grid-area:footer] flex h-8.25 items-stretch justify-between overflow-hidden border-t border-divider bg-black text-xs">
			<div className="flex min-w-0 items-stretch">
				<span className="flex shrink-0 items-center bg-accent px-3 font-semibold tracking-wide text-black">
					NORMAL
				</span>
				<span className="hidden shrink-0 items-center gap-1.5 border-r border-divider px-3 text-prompt/80 sm:flex">
					<GitBranch className="size-3 shrink-0" />
					{__GIT_BRANCH__}
				</span>
				<span className="hidden min-w-0 items-center truncate border-r border-divider px-3 text-subtle md:flex">
					{cwd}
				</span>
				<span className="hidden shrink-0 items-center gap-1.5 border-r border-divider px-3 text-accent sm:flex">
					<Check className="size-3 shrink-0" />
					CI passing
				</span>
			</div>
			<div className="flex shrink-0 items-stretch">
				<span className="hidden items-center border-l border-divider px-3 text-muted lg:flex">
					{FONT}
				</span>
				<span
					className="flex items-center px-3 text-host/80 tabular-nums"
					suppressHydrationWarning
				>
					{now}
				</span>
			</div>
		</footer>
	);
}
