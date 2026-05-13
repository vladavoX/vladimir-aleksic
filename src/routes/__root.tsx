import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { Header } from "#/components/header";
import { Main } from "#/components/main";
import { SidebarLeft } from "#/components/sidebar-left";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
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

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="grid grid-cols-[18rem_1fr_18rem] grid-rows-[auto_1fr_auto] h-screen overflow-hidden [grid-template-areas:'header_header_header''sidebar_main_rSidebar''footer_footer_footer'] text-xs text-white/70">
					<Header />
					<SidebarLeft setActiveTabs={setActiveTabs} />
					<Main activeTabs={activeTabs} setActiveTabs={setActiveTabs}>
						{children}
					</Main>
					<aside className="[grid-area:rSidebar] p-4 border-l border-divider">
						Right Sidebar Content
					</aside>
					<footer className="[grid-area:footer] px-4 py-2 border-t border-divider bg-black">
						Footer Content
					</footer>
				</div>
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
				<Scripts />
			</body>
		</html>
	);
}
