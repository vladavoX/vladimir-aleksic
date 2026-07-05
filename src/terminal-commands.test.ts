import { describe, expect, it } from "vitest";
import { type CommandContext, runCommand } from "#/terminal-commands";
import { formatDate } from "#/utils";

const files = [
	{ name: "README.md", to: "/" },
	{ name: "skills.json", to: "/skills" },
	{ name: "experience.log", to: "/experience" },
];

const ctx: CommandContext = {
	files,
	now: () => new Date("2026-07-05T12:00:00Z"),
	whoami: "Vladimir Aleksic — Full-Stack Developer · Novi Sad, RS",
};

const texts = (input: string) =>
	runCommand(input, ctx).lines.map((line) => line.text);

describe("runCommand", () => {
	it("returns nothing for empty or whitespace input", () => {
		expect(runCommand("", ctx)).toEqual({ lines: [] });
		expect(runCommand("   ", ctx)).toEqual({ lines: [] });
	});

	it("help lists every command", () => {
		const listed = texts("help").join("\n");
		for (const name of [
			"help",
			"ls",
			"cd",
			"open",
			"whoami",
			"echo",
			"date",
			"clear",
			"theme",
		]) {
			expect(listed).toContain(name);
		}
	});

	it("ls lists the injected files", () => {
		expect(texts("ls")).toEqual(["README.md", "skills.json", "experience.log"]);
	});

	it("echo prints its argument, empty when none", () => {
		expect(texts("echo hello world")).toEqual(["hello world"]);
		expect(texts("echo")).toEqual([""]);
	});

	it("whoami prints the injected identity", () => {
		expect(texts("whoami")).toEqual([ctx.whoami]);
	});

	it("date formats the injected clock", () => {
		expect(texts("date")).toEqual([formatDate(ctx.now())]);
	});

	it("cd and open resolve a route by name, path, or bare path", () => {
		for (const arg of ["experience", "experience.log", "/experience"]) {
			expect(runCommand(`cd ${arg}`, ctx).effect).toEqual({
				type: "navigate",
				to: "/experience",
			});
		}
		expect(runCommand("open skills", ctx).effect).toEqual({
			type: "navigate",
			to: "/skills",
		});
	});

	it("cd errors on an unknown file, with no effect", () => {
		const result = runCommand("cd nope", ctx);
		expect(result.effect).toBeUndefined();
		expect(result.lines[0].kind).toBe("error");
	});

	it("clear emits a clear effect and no lines", () => {
		expect(runCommand("clear", ctx)).toEqual({
			lines: [],
			effect: { type: "clear" },
		});
	});

	it("theme prints the dark stub", () => {
		expect(texts("theme")).toEqual(["dark (only option, for now)"]);
	});

	it("unknown command returns a not-found error line", () => {
		const result = runCommand("banana", ctx);
		expect(result.lines[0].kind).toBe("error");
		expect(result.lines[0].text).toContain("command not found");
	});
});
