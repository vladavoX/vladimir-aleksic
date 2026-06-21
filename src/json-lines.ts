export type TokenKind =
	| "key"
	| "string"
	| "number"
	| "bool"
	| "null"
	| "punct"
	| "plain";

export interface Token {
	text: string;
	kind: TokenKind;
}

export type Line = Token[];

const INDENT = "  ";

const punct = (text: string): Token => ({ text, kind: "punct" });
const plain = (text: string): Token => ({ text, kind: "plain" });
const indent = (level: number): Token => plain(INDENT.repeat(level));

const primitiveToken = (value: string | number | boolean | null): Token => {
	if (value === null) return { text: "null", kind: "null" };
	if (typeof value === "string") return { text: `"${value}"`, kind: "string" };
	if (typeof value === "number") return { text: String(value), kind: "number" };
	return { text: String(value), kind: "bool" };
};

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

// Walk a JSON value and emit colored token lines laid out exactly like
// JSON.stringify(value, null, 2). `leading` is the tokens already on the
// opening line (indent + optional `"key": `); `trailing` is a "," when the
// value is followed by a sibling.
function emit(
	value: unknown,
	level: number,
	leading: Token[],
	trailing: string,
): Line[] {
	const close = (bracket: string): Token => punct(bracket + trailing);

	if (isObject(value)) {
		const keys = Object.keys(value);
		if (keys.length === 0) return [[...leading, close("{}")]];
		const lines: Line[] = [[...leading, punct("{")]];
		keys.forEach((key, i) => {
			const childLeading: Token[] = [
				indent(level + 1),
				{ text: `"${key}"`, kind: "key" },
				punct(":"),
				plain(" "),
			];
			const childTrailing = i < keys.length - 1 ? "," : "";
			lines.push(...emit(value[key], level + 1, childLeading, childTrailing));
		});
		lines.push([indent(level), close("}")]);
		return lines;
	}

	if (Array.isArray(value)) {
		if (value.length === 0) return [[...leading, close("[]")]];
		const lines: Line[] = [[...leading, punct("[")]];
		value.forEach((item, i) => {
			const childTrailing = i < value.length - 1 ? "," : "";
			lines.push(...emit(item, level + 1, [indent(level + 1)], childTrailing));
		});
		lines.push([indent(level), close("]")]);
		return lines;
	}

	const tail: Token[] = trailing ? [punct(trailing)] : [];
	return [
		[
			...leading,
			primitiveToken(value as string | number | boolean | null),
			...tail,
		],
	];
}

export function buildJsonLines(value: unknown): Line[] {
	return emit(value, 0, [], "");
}
