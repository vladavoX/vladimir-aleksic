import { formatDate } from "#/utils";

export type OutputLine = {
	kind: "input" | "output" | "error" | "success" | "file" | "help";
	text: string;
};

export type Effect = { type: "clear" } | { type: "navigate"; to: string };

export interface CommandFile {
	name: string;
	to: string;
}

export interface CommandContext {
	files: CommandFile[];
	now: () => Date;
	whoami: string;
}

export interface CommandResult {
	lines: OutputLine[];
	effect?: Effect;
}

const out = (text: string): OutputLine => ({ kind: "output", text });
const err = (text: string): OutputLine => ({ kind: "error", text });
const ok = (text: string): OutputLine => ({ kind: "success", text });
const file = (text: string): OutputLine => ({ kind: "file", text });

const COMMANDS: { name: string; description: string }[] = [
	{ name: "help", description: "list available commands" },
	{ name: "ls", description: "list files" },
	{ name: "cd", description: "open a file (alias: open)" },
	{ name: "open", description: "open a file (alias: cd)" },
	{ name: "whoami", description: "print identity" },
	{ name: "echo", description: "print text" },
	{ name: "date", description: "print the current date and time" },
	{ name: "clear", description: "clear the terminal" },
	{ name: "theme", description: "show the color theme" },
];

const COMMAND_NAMES = COMMANDS.map((command) => command.name);

function resolveRoute(arg: string, files: CommandFile[]): string | undefined {
	const query = arg.trim().toLowerCase();
	for (const entry of files) {
		const bare = entry.to.replace(/^\//, "").toLowerCase();
		if (
			query === entry.name.toLowerCase() ||
			query === entry.to.toLowerCase() ||
			query === bare
		) {
			return entry.to;
		}
	}
	return undefined;
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
	const trimmed = input.trim();
	if (trimmed === "") return { lines: [] };

	const [cmd, ...rest] = trimmed.split(/\s+/);
	const arg = rest.join(" ");

	switch (cmd) {
		case "help":
			// A single "help" line whose text is tab/newline-delimited rows
			// (name<TAB>description); the component lays it out as a grid.
			return {
				lines: [
					{
						kind: "help",
						text: COMMANDS.map(
							(command) => `${command.name}\t${command.description}`,
						).join("\n"),
					},
				],
			};
		case "ls":
			return { lines: ctx.files.map((entry) => file(entry.name)) };
		case "cd":
		case "open": {
			if (arg === "") {
				return { lines: [err(`${cmd}: missing file — try 'ls'`)] };
			}
			const to = resolveRoute(arg, ctx.files);
			if (!to) {
				return { lines: [err(`${cmd}: no such file: ${arg}`)] };
			}
			return {
				lines: [ok(`opening ${arg}…`)],
				effect: { type: "navigate", to },
			};
		}
		case "whoami":
			return { lines: [out(ctx.whoami)] };
		case "echo":
			return { lines: [out(arg)] };
		case "date":
			return { lines: [out(formatDate(ctx.now()))] };
		case "clear":
			return { lines: [], effect: { type: "clear" } };
		case "theme":
			return { lines: [out("dark (only option, for now)")] };
		default:
			return { lines: [err(`command not found: ${cmd} — type 'help'`)] };
	}
}

export interface Completion {
	/** The input value after applying the completion. */
	value: string;
	/** Candidates to display when the token is ambiguous (length > 1). */
	suggestions: string[];
}

function longestCommonPrefix(items: string[]): string {
	if (items.length === 0) return "";
	let prefix = items[0];
	for (const item of items) {
		while (!item.startsWith(prefix)) {
			prefix = prefix.slice(0, -1);
			if (prefix === "") return "";
		}
	}
	return prefix;
}

// Complete `token` against `candidates`, keeping `before` (everything left of
// the token, e.g. leading whitespace or "cd ") intact. On a single match, the
// completion is committed and `suffix` (a trailing space for commands) is
// appended; on several, the input advances to their common prefix and the
// matches are returned for display.
function completeToken(
	before: string,
	token: string,
	candidates: string[],
	suffix: string,
): Completion {
	const matches = candidates.filter((candidate) => candidate.startsWith(token));
	if (matches.length === 0) return { value: before + token, suggestions: [] };
	if (matches.length === 1) {
		return { value: before + matches[0] + suffix, suggestions: [] };
	}
	const common = longestCommonPrefix(matches);
	const completed = common.length > token.length ? common : token;
	return { value: before + completed, suggestions: matches };
}

// Tab-completion for the terminal input, assuming the cursor is at the end.
// Completes the command name while typing the first word, or a file name as
// the argument to `cd`/`open`.
export function completeInput(input: string, files: CommandFile[]): Completion {
	const leading = input.match(/^\s*/)?.[0] ?? "";
	const rest = input.slice(leading.length);

	if (!/\s/.test(rest)) {
		return completeToken(leading, rest, COMMAND_NAMES, " ");
	}

	const parts = rest.match(/^(\S+)(\s+)(.*)$/);
	if (!parts) return { value: input, suggestions: [] };
	const [, cmd, gap, arg] = parts;
	if ((cmd === "cd" || cmd === "open") && !/\s/.test(arg)) {
		const names = files.map((entry) => entry.name);
		return completeToken(leading + cmd + gap, arg, names, "");
	}
	return { value: input, suggestions: [] };
}
