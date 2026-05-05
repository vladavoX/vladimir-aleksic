import { createFileRoute } from "@tanstack/react-router";
import { Header } from "#/components/header";
import { SidebarLeft } from "#/components/sidebar-left";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="grid grid-cols-[18rem_1fr_18rem] grid-rows-[auto_1fr_auto] min-h-screen [grid-template-areas:'header_header_header''sidebar_main_rSidebar''footer_footer_footer'] text-xs text-white/70">
			<Header />
			<SidebarLeft />
			<main className="[grid-area:main] p-4">Main Content</main>
			<aside className="[grid-area:rSidebar] p-4">Right Sidebar Content</aside>
			<footer className="[grid-area:footer] p-4">Footer Content</footer>
		</div>
	);
}
