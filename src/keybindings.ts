// A pure event → action mapping, mirroring terminal-commands.ts: no DOM, so
// the bindings are unit-tested directly. The React shell in
// components/terminal.tsx owns what each action actually does.

export interface ShortcutEvent {
	ctrlKey: boolean;
	metaKey: boolean;
	altKey: boolean;
	shiftKey: boolean;
	code: string;
	key: string;
}

export type Shortcut = "toggle" | "clear" | "close";

export function matchShortcut(event: ShortcutEvent): Shortcut | null {
	const { ctrlKey, metaKey, altKey, shiftKey, code, key } = event;

	// `code` is the physical key, unlike `key` which is the character the
	// layout produces — the backtick moves around (or needs a dead key) on
	// non-US layouts, so matching on `key` here would break for those users.
	if (code === "Backquote" && ctrlKey && !metaKey && !altKey && !shiftKey) {
		return "toggle";
	}
	// Cmd+J on macOS, Ctrl+J elsewhere, but never both held at once.
	if (
		ctrlKey !== metaKey &&
		!altKey &&
		!shiftKey &&
		key.toLowerCase() === "j"
	) {
		return "toggle";
	}
	if (key === "Escape" && !ctrlKey && !metaKey && !altKey && !shiftKey) {
		return "close";
	}
	if (
		ctrlKey &&
		!metaKey &&
		!altKey &&
		!shiftKey &&
		key.toLowerCase() === "l"
	) {
		return "clear";
	}
	return null;
}
