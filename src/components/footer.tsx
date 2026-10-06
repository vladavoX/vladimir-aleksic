import { useLocation } from "@tanstack/react-router";
import { Check, GitBranch, type LucideIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { fileName } from "#/files";

const FONT = "JetBrains Mono";

// Both URLs track the branch this bundle was built from — the same value the
// branch cell two positions to the left shows. Pinning them to `master` would
// make a preview deploy report a verdict about code it is not running.
// Encoded because branch names may contain `/`, `#` and `?`.
const CI_BRANCH = encodeURIComponent(__GIT_BRANCH__);
const CI_RUNS_URL = `https://github.com/vladavoX/vladimir-aleksic/actions/workflows/ci.yml?query=branch%3A${CI_BRANCH}`;
const CI_API_URL = `https://api.github.com/repos/vladavoX/vladimir-aleksic/actions/workflows/ci.yml/runs?branch=${CI_BRANCH}&status=completed&per_page=1`;

type CiStatus = "unknown" | "passing" | "failing";

// Only conclusions that are actually a verdict map to one; "cancelled",
// "skipped" and friends leave the badge saying nothing.
const CI_CONCLUSIONS: Record<string, CiStatus> = {
	success: "passing",
	failure: "failing",
	timed_out: "failing",
	startup_failure: "failing",
};

const CI_BADGE: Record<
	CiStatus,
	{ label: string; className: string; Icon?: LucideIcon }
> = {
	// No icon and no verdict — the badge must not assert what it does not know.
	unknown: { label: "CI", className: "text-muted" },
	passing: { label: "CI passing", className: "text-accent", Icon: Check },
	// Red rather than the theme's amber: amber is already the branch indicator
	// two cells to the left, so it would not read as distinct.
	failing: { label: "CI failing", className: "text-red-400", Icon: X },
};

// "unknown" on the server and the first client render so hydration matches,
// then whatever the public Actions API reports for the latest completed run.
// The repo is private today, so the unauthenticated call 404s and the badge
// honestly stays "unknown" — it starts reporting by itself if the repo ever
// goes public. Deliberately no credential: this runs in the browser, so any
// token here would be a published token.
function useCiStatus() {
	const [status, setStatus] = useState<CiStatus>("unknown");

	useEffect(() => {
		const controller = new AbortController();

		fetch(CI_API_URL, {
			signal: controller.signal,
			headers: { Accept: "application/vnd.github+json" },
		})
			.then((response) => (response.ok ? response.json() : undefined))
			.then((body) => {
				const conclusion = body?.workflow_runs?.[0]?.conclusion;
				const next =
					typeof conclusion === "string" && CI_CONCLUSIONS[conclusion];
				if (next) setStatus(next);
			})
			.catch(() => {
				// Offline, blocked, rate-limited, private repo, shape changed — every
				// one of those leaves the badge claiming nothing.
			});

		return () => controller.abort();
	}, []);

	return status;
}

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
	const ci = CI_BADGE[useCiStatus()];

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
				<a
					href={CI_RUNS_URL}
					target="_blank"
					rel="noreferrer"
					className={`hidden shrink-0 items-center gap-1.5 border-r border-divider px-3 sm:flex ${ci.className}`}
				>
					{ci.Icon && <ci.Icon className="size-3 shrink-0" />}
					{ci.label}
				</a>
			</div>
			<div className="flex shrink-0 items-stretch">
				<span className="hidden items-center border-l border-divider px-3 text-muted lg:flex">
					{FONT}
				</span>
				<span
					className="flex items-center border-l border-divider px-3 text-host/80 tabular-nums"
					suppressHydrationWarning
				>
					{now}
				</span>
			</div>
		</footer>
	);
}
