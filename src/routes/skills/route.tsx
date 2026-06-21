import { createFileRoute } from "@tanstack/react-router";
import { JsonViewer } from "#/components/json-viewer";
import skills from "#/data/skills.json";

export const Route = createFileRoute("/skills")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-muted/10 flex-1 px-4 md:px-8">
			<JsonViewer value={skills} />
		</div>
	);
}
