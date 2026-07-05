import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";
import { SidebarLeft } from "#/components/sidebar-left";
import { files } from "#/files";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Vladimir Aleksic — Full-Stack Developer" },
			{
				name: "description",
				content:
					"Full-stack developer at Plainly, building Plainly Videos and Plainly Flows with TypeScript, React, TanStack, and Node. Based in Novi Sad, Serbia — open to work.",
			},
			{ name: "color-scheme", content: "dark" },
			{ name: "theme-color", content: "#000000" },
			{ property: "og:type", content: "website" },
			{
				property: "og:title",
				content: "Vladimir Aleksic — Full-Stack Developer",
			},
			{
				property: "og:description",
				content:
					"Full-stack developer at Plainly. TypeScript, React, TanStack, and Node. Based in Novi Sad, Serbia.",
			},
			{ name: "twitter:card", content: "summary" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const [activeTabs, setActiveTabs] = useState<Set<string>>(
		new Set([pathname]),
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
