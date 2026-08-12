import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { files } from "#/files";
import { absoluteUrl, SITE_URL } from "#/site";

const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const sitemap = read("../public/sitemap.xml");
const robots = read("../public/robots.txt");

const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
	(match) => match[1],
);

// The router, not the sidebar file list: a route can exist without a nav entry,
// and the sitemap has to cover it either way.
const routesDir = new URL("routes/", import.meta.url);
const routePaths = readdirSync(routesDir, { recursive: true, encoding: "utf8" })
	.filter((entry) => entry.endsWith(".tsx"))
	.flatMap((entry) => [
		...read(`routes/${entry}`).matchAll(/createFileRoute\("(.*?)"\)/g),
	])
	.map((match) => match[1]);

// The sitemap is hand-written, so it rots the moment a route is added. These
// assertions are the drift guard, in both directions.
describe("sitemap.xml", () => {
	it("lists every route in the router", () => {
		expect(routePaths.length).toBeGreaterThan(0);
		for (const path of routePaths) {
			expect(locs).toContain(absoluteUrl(path));
		}
	});

	it("lists nothing beyond those routes and the CV", () => {
		const expected = [...routePaths.map(absoluteUrl), absoluteUrl("/cv.html")];
		expect([...locs].sort()).toEqual([...expected].sort());
	});

	it("uses absolute URLs on the site origin", () => {
		expect(locs.length).toBeGreaterThan(0);
		for (const loc of locs) {
			expect(loc.startsWith(`${SITE_URL}/`)).toBe(true);
		}
	});
});

describe("robots.txt", () => {
	// Hard-coded origin in a file no test would otherwise read: without this, a
	// change of SITE_URL leaves robots pointing at the old host's sitemap.
	it("points at the sitemap on the site origin", () => {
		expect(robots).toContain(`Sitemap: ${absoluteUrl("/sitemap.xml")}`);
	});
});

describe("files.tsx", () => {
	it("only links routes the router actually has", () => {
		for (const file of files) {
			expect(routePaths).toContain(file.to);
		}
	});
});
