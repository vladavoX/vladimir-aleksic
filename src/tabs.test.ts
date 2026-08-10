import { describe, expect, it } from "vitest";
import { parseTabs, serializeTabs } from "#/tabs";

const knownRoutes = ["/", "/skills", "/experience", "/projects", "/contact"];

describe("serializeTabs / parseTabs", () => {
	it("round-trips an ordered tab list", () => {
		const tabs = ["/skills", "/", "/projects"];
		expect(parseTabs(serializeTabs(tabs), knownRoutes)).toEqual(tabs);
	});

	it("round-trips an empty tab list", () => {
		expect(parseTabs(serializeTabs([]), knownRoutes)).toEqual([]);
	});

	it("returns [] for null", () => {
		expect(parseTabs(null, knownRoutes)).toEqual([]);
	});

	it("returns [] for malformed JSON", () => {
		expect(parseTabs("{not json", knownRoutes)).toEqual([]);
	});

	it("returns [] for the wrong version", () => {
		expect(
			parseTabs(JSON.stringify({ v: 2, tabs: ["/"] }), knownRoutes),
		).toEqual([]);
	});

	it("returns [] when the version is missing", () => {
		expect(parseTabs(JSON.stringify({ tabs: ["/"] }), knownRoutes)).toEqual([]);
	});

	it("returns [] when tabs is not an array", () => {
		expect(
			parseTabs(JSON.stringify({ v: 1, tabs: "/skills" }), knownRoutes),
		).toEqual([]);
	});

	it("returns [] when an entry is not a string", () => {
		expect(
			parseTabs(JSON.stringify({ v: 1, tabs: ["/", 1] }), knownRoutes),
		).toEqual([]);
	});

	it("returns [] on duplicate entries", () => {
		expect(
			parseTabs(
				JSON.stringify({ v: 1, tabs: ["/", "/skills", "/"] }),
				knownRoutes,
			),
		).toEqual([]);
	});

	it("filters out routes that are not known, preserving order of the rest", () => {
		expect(
			parseTabs(
				JSON.stringify({ v: 1, tabs: ["/skills", "/deleted-route", "/"] }),
				knownRoutes,
			),
		).toEqual(["/skills", "/"]);
	});
});
