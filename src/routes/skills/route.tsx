import { createFileRoute } from "@tanstack/react-router";
import { JsonViewer } from "#/components/json-viewer";
import skills from "#/data/skills.json";
import { absoluteUrl, canonical } from "#/site";

const TITLE = "Skills — Vladimir Aleksic";
const DESCRIPTION =
	"The whole stack as JSON: TypeScript, React and TanStack on the front, Node and Spring Boot behind it, Vitest and Playwright around both.";

export const Route = createFileRoute("/skills")({
	head: () => ({
		meta: [
			{ title: TITLE },
			{ name: "description", content: DESCRIPTION },
			{ property: "og:title", content: TITLE },
			{ property: "og:description", content: DESCRIPTION },
			{ property: "og:url", content: absoluteUrl("/skills") },
		],
		links: [canonical("/skills")],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-surface flex-1 *:mx-auto *:w-full *:max-w-5xl px-4 md:px-8 pt-4 md:pt-8 space-y-2">
			<h1 className="text-accent text-2xl">What I work with</h1>
			<JsonViewer value={skills} />
		</div>
	);
}
