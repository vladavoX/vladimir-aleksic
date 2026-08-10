import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef, useState } from "react";
import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";
import { SidebarLeft } from "#/components/sidebar-left";
import { files } from "#/files";
import { parseTabs, serializeTabs, TABS_STORAGE_KEY } from "#/tabs";
import appCss from "../styles.css?url";

// Scrapers only follow absolute image URLs, so the card image is emitted only
// when the deploy origin is known (set VITE_SITE_URL at build time).
const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Vladimir Aleksic — Full-Stack Engineer" },
			{
				name: "description",
				content:
					"Full-stack engineer at Plainly, frontend-focused: I own the Plainly Videos dashboard, took PlainlyFlows from empty repo to launch, and maintain the Adobe ↔ Plainly After Effects plugin. TypeScript, React, TanStack, Node. Novi Sad, Serbia — open to work.",
			},
			{ name: "color-scheme", content: "dark" },
			{ name: "theme-color", content: "#000000" },
			{ property: "og:type", content: "website" },
			{
				property: "og:title",
				content: "Vladimir Aleksic — Full-Stack Engineer",
			},
			{
				property: "og:description",
				content:
					"Full-stack engineer at Plainly, frontend-focused. TypeScript, React, TanStack, Node. Novi Sad, Serbia — open to work.",
			},
			{ property: "og:site_name", content: "Vladimir Aleksic" },
			{ property: "og:locale", content: "en_US" },
			{ name: "twitter:card", content: "summary" },
			...(siteUrl
				? [
						{ property: "og:image", content: `${siteUrl}/logo512.png` },
						{
							property: "og:image:alt",
							content: "Vladimir Aleksic — portfolio",
						},
					]
				: []),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{ rel: "apple-touch-icon", href: "/logo192.png" },
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function NotFound() {
	const pathname = useLocation({ select: (location) => location.pathname });

	return (
		<div className="bg-muted/10 flex-1 p-4 md:p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">404 — no such file</h1>
				<p className="text-subtle text-sm">
					<span className="text-prompt">cat: .{pathname}</span>: No such file or
					directory
				</p>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">FILES IN ~/portfolio</h2>
				<ul className="space-y-2">
					{files.map((file) => (
						<li key={file.to}>
							<Link
								to={file.to}
								className="flex items-center gap-3 rounded-sm border border-divider bg-black p-3 text-host underline-offset-2 hover:underline"
							>
								<span className="flex w-4 shrink-0 justify-center text-accent-border">
									{file.icon}
								</span>
								{file.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	// Only real file routes get a tab, so landing on an unknown URL shows the
	// 404 without opening a nameless tab for it.
	const [activeTabs, setActiveTabs] = useState<Set<string>>(
		new Set(files.some((file) => file.to === pathname) ? [pathname] : ["/"]),
	);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Any navigation to a known file route opens its tab — single source of
	// truth for terminal `cd`/`open`, direct URLs, and back/forward alike.
	useEffect(() => {
		if (!files.some((file) => file.to === pathname)) return;
		setActiveTabs((prev) =>
			prev.has(pathname) ? prev : new Set(prev).add(pathname),
		);
	}, [pathname]);

	// Restore persisted tabs after mount, not in the useState initializer
	// above: the initializer runs during the first client render too, and
	// localStorage isn't available on the server, so folding this in there
	// would make that first client render disagree with the server-rendered
	// HTML — a hydration mismatch. Running once here means restored tabs pop
	// in a frame after paint instead, which is the trade-off we accept.
	//
	// Intentionally once: this restores whatever was on disk at mount, not
	// on every pathname change (the effect above already keeps the current
	// route's tab open on navigation).
	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only restore, pathname read once
	useEffect(() => {
		try {
			if (typeof window === "undefined") return;
			const stored = parseTabs(
				window.localStorage.getItem(TABS_STORAGE_KEY),
				files.map((file) => file.to),
			);
			if (stored.length === 0) return;
			setActiveTabs(
				new Set(stored.includes(pathname) ? stored : [...stored, pathname]),
			);
		} catch {
			// Safari private mode (and friends) throws on localStorage.getItem
			// too, not only on writes — fall back to the URL-only tab silently.
		}
	}, []);

	// Persist whenever the tab set changes. The restore effect above is
	// declared first, so on mount it always runs before this one — but its
	// setState doesn't apply until the next render, so this effect's own
	// first run still sees the pre-restore, URL-only state. Skip that one
	// call: once restore's update (if any) lands, this effect reruns with
	// the real value and writes it, so storage is never clobbered with a
	// stale snapshot in between.
	const isFirstWrite = useRef(true);
	useEffect(() => {
		if (isFirstWrite.current) {
			isFirstWrite.current = false;
			return;
		}
		try {
			if (typeof window === "undefined") return;
			window.localStorage.setItem(TABS_STORAGE_KEY, serializeTabs(activeTabs));
		} catch {
			// Storage inaccessible — tabs just won't persist this session.
		}
	}, [activeTabs]);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="grid grid-cols-[1fr] md:grid-cols-[18rem_1fr] grid-rows-[auto_1fr_auto] h-screen overflow-hidden [grid-template-areas:'header''main''footer'] md:[grid-template-areas:'header_header''sidebar_main''footer_footer'] text-xs text-white/70">
					<Header onMenuClick={() => setIsSidebarOpen((o) => !o)} />
					<SidebarLeft
						setActiveTabs={setActiveTabs}
						isOpen={isSidebarOpen}
						onClose={() => setIsSidebarOpen(false)}
					/>
					<Main activeTabs={activeTabs} setActiveTabs={setActiveTabs}>
						{children}
					</Main>
					{/* TODO: right sidebar — live GitHub stats. Out of scope for MVP. */}
					{/* <aside className="[grid-area:rSidebar] p-4 border-l border-divider">
						Right Sidebar Content
					</aside> */}
					<Footer />
				</div>
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
