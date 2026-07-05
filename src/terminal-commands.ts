import { formatDate } from "#/utils";

export type OutputLine = {
	kind: "input" | "output" | "error";
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

function resolveRoute(arg: string, files: CommandFile[]): string | undefined {
	const query = arg.trim().toLowerCase();
	for (const file of files) {
		const bare = file.to.replace(/^\//, "").toLowerCase();
		if (
			query === file.name.toLowerCase() ||
			query === file.to.toLowerCase() ||
			query === bare
		) {
			return file.to;
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
			return {
				lines: COMMANDS.map((command) =>
					out(`${command.name.padEnd(8)} ${command.description}`),
				),
			};
		case "ls":
			return { lines: ctx.files.map((file) => out(file.name)) };
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
				lines: [out(`opening ${arg}…`)],
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
