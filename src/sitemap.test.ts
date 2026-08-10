import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { files } from "#/files";
import { absoluteUrl, SITE_URL } from "#/site";

const sitemap = readFileSync(
	new URL("../public/sitemap.xml", import.meta.url),
	"utf8",
);

const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
	(match) => match[1],
);

// The sitemap is hand-written, so it rots the moment a route is added. These
// assertions are the drift guard, in both directions.
describe("sitemap.xml", () => {
	it("lists every route in the file tree", () => {
		for (const file of files) {
			expect(locs).toContain(absoluteUrl(file.to));
		}
	});

	it("lists nothing beyond those routes and the CV", () => {
		const expected = [
			...files.map((file) => absoluteUrl(file.to)),
			absoluteUrl("/cv.html"),
		];
		expect([...locs].sort()).toEqual([...expected].sort());
	});

	it("uses absolute URLs on the site origin", () => {
		expect(locs.length).toBeGreaterThan(0);
		for (const loc of locs) {
			expect(loc.startsWith(`${SITE_URL}/`)).toBe(true);
		}
	});
});
