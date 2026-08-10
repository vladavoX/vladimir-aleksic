import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "#/security-headers";

// `public/_headers` covers static assets and SECURITY_HEADERS covers SSR
// documents. Two surfaces, so the list has to be written twice — this test is
// what keeps the copies honest.
function parseHeadersFile(source: string) {
	const rules: Record<string, Record<string, string>> = {};
	let current: Record<string, string> | undefined;

	for (const line of source.split("\n")) {
		if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
		if (!/^\s/.test(line)) {
			current = {};
			rules[line.trim()] = current;
			continue;
		}
		const separator = line.indexOf(":");
		if (separator === -1 || !current) continue;
		current[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
	}

	return rules;
}

describe("public/_headers", () => {
	const rules = parseHeadersFile(
		readFileSync(new URL("../public/_headers", import.meta.url), "utf8"),
	);

	it("applies the SSR document's security headers to every asset", () => {
		expect(rules["/*"]).toEqual(SECURITY_HEADERS);
	});
});
