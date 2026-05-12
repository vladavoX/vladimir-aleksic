import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/now")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/now"!</div>;
}
