import { describe, expect, it } from "vitest";
import { buildJsonLines } from "#/json-lines";

const lineText = (line: { text: string }[]) =>
	line.map((token) => token.text).join("");

const render = (value: unknown) =>
	buildJsonLines(value).map(lineText).join("\n");

describe("buildJsonLines", () => {
	it("reconstructs the same text as JSON.stringify(_, null, 2)", () => {
		const samples: unknown[] = [
			{ a: ["x"] },
			{ languages: ["TypeScript", "JavaScript"], years: 4, active: true },
			{ nested: { deep: { value: null } }, list: [1, 2, 3] },
			{ empty: {}, none: [] },
		];
		for (const sample of samples) {
			expect(render(sample)).toBe(JSON.stringify(sample, null, 2));
		}
	});

	it("tags object keys as key tokens", () => {
		const lines = buildJsonLines({ languages: ["TypeScript"] });
		const keyLine = lines.find((line) =>
			line.some((token) => token.text === '"languages"'),
		);
		const keyToken = keyLine?.find((token) => token.text === '"languages"');
		expect(keyToken?.kind).toBe("key");
	});

	it("tags string values, numbers, booleans and null distinctly", () => {
		const lines = buildJsonLines({
			name: "TypeScript",
			years: 4,
			active: true,
			retired: null,
		});
		const tokens = lines.flat();
		expect(tokens.find((t) => t.text === '"TypeScript"')?.kind).toBe("string");
		expect(tokens.find((t) => t.text === "4")?.kind).toBe("number");
		expect(tokens.find((t) => t.text === "true")?.kind).toBe("bool");
		expect(tokens.find((t) => t.text === "null")?.kind).toBe("null");
	});

	it("keeps a value string distinct from a key with the same text", () => {
		// "name" appears as a key; as a string value it must NOT be a key token
		const lines = buildJsonLines({ key: "name" });
		const tokens = lines.flat();
		expect(tokens.find((t) => t.text === '"key"')?.kind).toBe("key");
		expect(tokens.find((t) => t.text === '"name"')?.kind).toBe("string");
	});
});
