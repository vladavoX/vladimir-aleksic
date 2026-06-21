import { createFileRoute } from "@tanstack/react-router";
import { JsonViewer } from "#/components/json-viewer";

export const Route = createFileRoute("/skills")({
	component: RouteComponent,
});

const skills = {
	languages: ["TypeScript", "JavaScript", "Java", "SQL"],
	frontend: [
		"React",
		"Next.js",
		"TanStack",
		"TanStack Query",
		"shadcn/ui",
		"Tailwind CSS",
		"CSS",
		"HTML",
	],
	mobile: ["React Native", "Expo"],
	backend: ["Node.js", "Express", "Spring Boot", "REST"],
	databases: [
		"PostgreSQL",
		"MongoDB",
		"MySQL",
		"SQLite",
		"Prisma",
		"Drizzle",
		"Mongoose",
		"Supabase",
	],
	auth: ["JWT", "NextAuth", "Clerk", "Auth0"],
	testing: {
		unit: ["Vitest", "Jest", "Testing Library"],
		e2e: ["Playwright", "Cypress"],
	},
	build: ["Vite", "Webpack", "esbuild", "Turborepo"],
	packageManagers: ["pnpm", "npm", "Bun", "Yarn"],
	devops: ["Docker", "GitHub Actions", "Vercel", "Cloudflare"],
	tooling: ["Git", "GitHub", "VSCode", "Postman", "Zod"],
	learning: ["Rust", "Zig"],
};

function RouteComponent() {
	return (
		<div className="bg-muted/10 flex-1 px-4 md:px-8">
			<JsonViewer value={skills} />
		</div>
	);
}
