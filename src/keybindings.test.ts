import { describe, expect, it } from "vitest";
import { matchShortcut, type ShortcutEvent } from "#/keybindings";

const event = (overrides: Partial<ShortcutEvent>): ShortcutEvent => ({
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	shiftKey: false,
	code: "",
	key: "",
	...overrides,
});

describe("matchShortcut", () => {
	it("toggles on Ctrl+` matched by physical key, not layout", () => {
		expect(
			matchShortcut(event({ ctrlKey: true, code: "Backquote", key: "`" })),
		).toBe("toggle");
	});

	it("does not toggle on Ctrl+` with an extra modifier held", () => {
		expect(
			matchShortcut(
				event({ ctrlKey: true, metaKey: true, code: "Backquote", key: "`" }),
			),
		).toBeNull();
		expect(
			matchShortcut(
				event({ ctrlKey: true, altKey: true, code: "Backquote", key: "`" }),
			),
		).toBeNull();
		expect(
			matchShortcut(
				event({ ctrlKey: true, shiftKey: true, code: "Backquote", key: "~" }),
			),
		).toBeNull();
	});

	it("ignores a bare backtick with no modifier", () => {
		expect(matchShortcut(event({ code: "Backquote", key: "`" }))).toBeNull();
	});

	it("toggles on Cmd+J or Ctrl+J, but not both held at once", () => {
		expect(matchShortcut(event({ metaKey: true, key: "j" }))).toBe("toggle");
		expect(matchShortcut(event({ ctrlKey: true, key: "j" }))).toBe("toggle");
		expect(
			matchShortcut(event({ ctrlKey: true, metaKey: true, key: "j" })),
		).toBeNull();
	});

	it("ignores a bare J with no modifier", () => {
		expect(matchShortcut(event({ key: "j" }))).toBeNull();
	});

	it("closes on a bare Escape", () => {
		expect(matchShortcut(event({ key: "Escape" }))).toBe("close");
	});

	it("does not close on Escape with a modifier held", () => {
		expect(matchShortcut(event({ key: "Escape", ctrlKey: true }))).toBeNull();
		expect(matchShortcut(event({ key: "Escape", shiftKey: true }))).toBeNull();
	});

	it("clears on Ctrl+L", () => {
		expect(matchShortcut(event({ ctrlKey: true, key: "l" }))).toBe("clear");
		expect(matchShortcut(event({ ctrlKey: true, key: "L" }))).toBe("clear");
	});

	it("does not clear on Ctrl+L with an extra modifier held", () => {
		expect(
			matchShortcut(event({ ctrlKey: true, metaKey: true, key: "l" })),
		).toBeNull();
	});

	it("ignores unrelated keys and combinations", () => {
		expect(matchShortcut(event({ key: "a" }))).toBeNull();
		expect(matchShortcut(event({ ctrlKey: true, key: "a" }))).toBeNull();
		expect(matchShortcut(event({ key: "Enter" }))).toBeNull();
	});
});
