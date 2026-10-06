import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	rootRouteId,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef, useState } from "react";
import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";
import { SidebarLeft } from "#/components/sidebar-left";
import { CONTACT } from "#/data/contact";
import skills from "#/data/skills.json";
import { files } from "#/files";
import { SECURITY_HEADERS } from "#/security-headers";
import { absoluteUrl, canonical } from "#/site";
import { parseTabs, serializeTabs, TABS_STORAGE_KEY } from "#/tabs";
import appCss from "../styles.css?url";

const TITLE = "Vladimir Aleksic — Full-Stack Engineer";

// Every skill group flattened, minus `learning` — that one lists what I'm
// picking up, which is not the same claim as knowing it.
const knowsAbout = [
	...new Set(
		Object.entries(skills)
			.filter(([group]) => group !== "learning")
			.flatMap(([, value]) =>
				Array.isArray(value) ? value : Object.values(value).flat(),
			),
	),
];

const HOME = absoluteUrl("/");
const PERSON_ID = `${HOME}#person`;

const person = {
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": PERSON_ID,
	name: "Vladimir Aleksic",
	url: HOME,
	jobTitle: "Full-Stack Engineer",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Novi Sad",
		addressCountry: "RS",
	},
	sameAs: CONTACT.filter((link) =>
		["GITHUB", "LINKEDIN"].includes(link.label),
	).map((link) => link.href),
	knowsAbout,
};

const profilePage = {
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	"@id": `${HOME}#profile`,
	url: HOME,
	name: TITLE,
	inLanguage: "en",
	mainEntity: { "@id": PERSON_ID },
};

export const Route = createRootRoute({
	headers: () => SECURITY_HEADERS,
	head: ({ matches }) => {
		// Head links are concatenated across matches and only collapse when
		// identical, so the canonical follows the matched route here rather than
		// pinning the site root and leaving every page with two of them.
		const leaf = matches[matches.length - 1];
		const path = leaf.fullPath;
		// Nothing matched: the leaf is the root itself and its `fullPath` is "/".
		// A self-canonical is impossible here, and pointing one at the home page
		// would tell crawlers every unknown URL is a duplicate of it, so the 404
		// gets no canonical and no `og:url` at all.
		const isNotFound = leaf.routeId === rootRouteId;
		const isHome = !isNotFound && absoluteUrl(path) === HOME;

		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title: TITLE },
				{
					name: "description",
					content:
						"Full-stack engineer at Plainly, frontend-focused: I own the Plainly Videos dashboard, took PlainlyFlows from empty repo to launch, and maintain the Adobe ↔ Plainly After Effects plugin. TypeScript, React, TanStack, Node. Novi Sad, Serbia — open to work.",
				},
				{ name: "author", content: "Vladimir Aleksic" },
				{ name: "color-scheme", content: "dark" },
				{ name: "theme-color", content: "#000000" },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: TITLE },
				{
					property: "og:description",
					content:
						"Full-stack engineer at Plainly, frontend-focused. TypeScript, React, TanStack, Node. Novi Sad, Serbia — open to work.",
				},
				{ property: "og:site_name", content: "Vladimir Aleksic" },
				{ property: "og:locale", content: "en_US" },
				...(isNotFound
					? []
					: [{ property: "og:url", content: absoluteUrl(path) }]),
				// Must be a file that actually exists in `public/` — a 404 here is a
				// blank card everywhere the site is shared. `public/og.png` is the
				// 1200×630 card `scripts/icons.mjs` generates, hence the large card.
				{ property: "og:image", content: absoluteUrl("/og.png") },
				{ property: "og:image:type", content: "image/png" },
				{ property: "og:image:width", content: "1200" },
				{ property: "og:image:height", content: "630" },
				{ property: "og:image:alt", content: TITLE },
				{ name: "twitter:card", content: "summary_large_image" },
			],
			links: [
				// Same-origin font preloads still need `crossorigin` to match the
				// CSS request, or the file is fetched twice.
				{
					rel: "preload",
					href: "/fonts/jetbrains-mono-latin.woff2",
					as: "font",
					type: "font/woff2",
					crossOrigin: "anonymous",
				},
				{
					rel: "stylesheet",
					href: appCss,
				},
				{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
				// Legacy fallback for anything that will not take the SVG.
				{ rel: "icon", href: "/favicon.ico", sizes: "48x48 32x32 16x16" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
				{ rel: "manifest", href: "/manifest.json" },
				...(isNotFound ? [] : [canonical(path)]),
			],
			scripts: [
				{ type: "application/ld+json", children: JSON.stringify(person) },
				// The ProfilePage node is keyed to the home page, so it belongs only
				// on the document it describes.
				...(isHome
					? [
							{
								type: "application/ld+json",
								children: JSON.stringify(profilePage),
							},
						]
					: []),
			],
		};
	},
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function NotFound() {
	const pathname = useLocation({ select: (location) => location.pathname });

	return (
		<div className="bg-surface flex-1 *:mx-auto *:w-full *:max-w-5xl p-4 md:p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">404 — no such file</h1>
				<p className="text-subtle text-sm">
					<span className="text-prompt">cat: .{pathname}</span>: No such file or
					directory
				</p>
			</div>
			<div className="space-y-3 pt-2">
				<h2 className="text-accent">
					<span aria-hidden="true" className="text-muted">
						##{" "}
					</span>
					FILES IN ~/portfolio
				</h2>
				<ul className="space-y-2">
					{files.map((file) => (
						<li key={file.to}>
							<Link
								to={file.to}
								className="flex items-center gap-3 rounded-sm border border-divider bg-black p-3 text-host underline-offset-2 hover:underline"
							>
								<span className="flex w-4 shrink-0 justify-center text-accent-dim">
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
	//
	// Merged into the existing set rather than replacing it, so the tab the
	// initializer already sanitized (a real file route, or "/" when the URL
	// is a 404) survives — appending the raw pathname here would open a
	// nameless tab for an unknown URL.
	useEffect(() => {
		try {
			const stored = parseTabs(
				window.localStorage.getItem(TABS_STORAGE_KEY),
				files.map((file) => file.to),
			);
			if (stored.length === 0) return;
			setActiveTabs((prev) => new Set([...stored, ...prev]));
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
				<div className="grid grid-cols-[1fr] md:grid-cols-[18rem_1fr] grid-rows-[auto_1fr_auto] h-dvh overflow-hidden [grid-template-areas:'header''main''footer'] md:[grid-template-areas:'header_header''sidebar_main''footer_footer'] text-xs text-white/70">
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
