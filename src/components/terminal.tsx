import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Kbd, KbdGroup } from "#/components/ui/kbd";
import { CONTACT } from "#/data/contact";
import { files } from "#/files";
import { matchShortcut } from "#/keybindings";
import {
	CWD,
	completeInput,
	type OutputLine,
	runCommand,
} from "#/terminal-commands";

const WHOAMI =
	"Vladimir Aleksic — Full-Stack Engineer, frontend-focused · Novi Sad, RS";
const PROMPT = `${CWD} $`;

type Entry = OutputLine & { id: number };

const WELCOME: Entry[] = [
	{ id: 0, kind: "output", text: "type 'help' to get started" },
];

// Every input to the command engine is a module constant, so the context is
// built once and shared by the typed-command and shortcut paths.
const COMMAND_CONTEXT = {
	files,
	now: () => new Date(),
	whoami: WHOAMI,
	contact: CONTACT,
};

// Two-column line kinds and the classes for their left/right column.
const gridClasses: Partial<Record<OutputLine["kind"], [string, string]>> = {
	help: ["text-accent", "text-muted"],
	contact: ["text-muted", "text-host"],
};

const lineClass = (kind: OutputLine["kind"]) => {
	if (kind === "error") return "text-prompt";
	if (kind === "success") return "text-accent";
	if (kind === "file") return "text-host";
	if (kind === "input") return "text-subtle";
	return "text-white/70";
};

export function Terminal() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);
	const [input, setInput] = useState("");
	const [lines, setLines] = useState<Entry[]>(WELCOME);
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const idRef = useRef(WELCOME.length);
	const inputRef = useRef<HTMLInputElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);

	// Open stays the initial state so the server markup and the first client
	// render agree; the collapse happens after mount, where `matchMedia` exists.
	// 12rem of terminal is most of a phone viewport, so phones start collapsed.
	// Negated `min-width` rather than `max-width` so the cutoff is the exact
	// complement of Tailwind's `sm:` — a `max-width: 640px` query would also
	// match at exactly 640px, where the layout is already in `sm` mode.
	useEffect(() => {
		if (!window.matchMedia("(min-width: 40rem)").matches) setOpen(false);
	}, []);

	const scrollToBottom = useCallback(() => {
		const body = bodyRef.current;
		if (body) body.scrollTop = body.scrollHeight;
	}, []);

	// `lines`/`open` are re-render triggers rather than values read here, so
	// they are referenced explicitly to satisfy the exhaustive-deps rule.
	useEffect(() => {
		void lines;
		void open;
		scrollToBottom();
	}, [lines, open, scrollToBottom]);

	// Clicking anywhere in the body focuses the input. Done with a native
	// listener rather than an onClick so the scroll region stays a plain,
	// non-interactive element (no a11y lint, no suppression). A click that
	// ends a text selection is left alone so output stays selectable.
	useEffect(() => {
		const body = bodyRef.current;
		if (!body) return;
		const focusInput = () => {
			if (window.getSelection()?.toString()) return;
			inputRef.current?.focus();
		};
		body.addEventListener("click", focusInput);
		return () => body.removeEventListener("click", focusInput);
	}, []);

	const submit = () => {
		const entry = input;
		const { lines: result, effect } = runCommand(entry, COMMAND_CONTEXT);

		if (effect?.type === "clear") {
			setLines([]);
		} else {
			const echo: OutputLine = { kind: "input", text: entry };
			const appended = [echo, ...result].map((line) => ({
				...line,
				id: idRef.current++,
			}));
			setLines((prev) => [...prev, ...appended]);
		}

		if (entry.trim() !== "") setHistory((prev) => [...prev, entry]);
		setInput("");
		setHistoryIndex(-1);

		if (effect?.type === "navigate") navigate({ to: effect.to });
		// Still inside the Enter keydown, so this counts as a user gesture and is
		// not treated as a popup.
		if (effect?.type === "open-url") {
			window.open(effect.url, "_blank", "noopener");
		}
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			submit();
			return;
		}
		if (event.key === "Tab") {
			event.preventDefault();
			const { value, suggestions } = completeInput(input, files);
			setInput(value);
			if (suggestions.length > 1) {
				const line: OutputLine = {
					kind: "output",
					text: suggestions.join("  "),
				};
				setLines((prev) => [...prev, { ...line, id: idRef.current++ }]);
			}
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			if (history.length === 0) return;
			const next =
				historyIndex === -1
					? history.length - 1
					: Math.max(0, historyIndex - 1);
			setHistoryIndex(next);
			setInput(history[next]);
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			if (historyIndex === -1) return;
			const next = historyIndex + 1;
			if (next >= history.length) {
				setHistoryIndex(-1);
				setInput("");
			} else {
				setHistoryIndex(next);
				setInput(history[next]);
			}
		}
	};

	// Shared by the header button and the Ctrl+`/Cmd+J shortcut, so the
	// open-and-focus / close-and-move-focus behavior lives in one place.
	// The side effects run after `setOpen`, not inside its updater — React
	// (and the React Compiler this repo builds with) requires updaters to
	// be pure and is entitled to call one more than once per update.
	const toggleOpen = useCallback(() => {
		const next = !open;
		setOpen(next);
		if (next) {
			requestAnimationFrame(() => {
				inputRef.current?.focus();
				scrollToBottom();
			});
		} else if (bodyRef.current?.contains(document.activeElement)) {
			// Move focus to the toggle button before collapsing: the collapsed
			// panel is `inert`, and leaving focus inside an inert subtree is
			// an accessibility trap.
			toggleButtonRef.current?.focus();
		}
	}, [open, scrollToBottom]);

	// Routes through the command engine rather than clearing `lines` directly,
	// so there is one code path for "clear" whether it's typed or shortcut-triggered.
	const clearTerminal = useCallback(() => {
		const { effect } = runCommand("clear", COMMAND_CONTEXT);
		if (effect?.type === "clear") setLines([]);
	}, []);

	useEffect(() => {
		const onWindowKeyDown = (event: KeyboardEvent) => {
			const shortcut = matchShortcut(event);
			if (!shortcut) return;

			if (shortcut === "toggle") {
				event.preventDefault();
				// Auto-repeat from a held-down chord would flip the panel dozens
				// of times a second and yank focus with it; one keypress, one toggle.
				if (event.repeat) return;
				toggleOpen();
				return;
			}

			if (shortcut === "close") {
				// Only steal Escape while it's actually doing something here —
				// panel open, and focus inside it — otherwise leave it alone.
				if (!open || !bodyRef.current?.contains(document.activeElement)) return;
				event.preventDefault();
				// `toggleOpen` owns the collapse, including moving focus out of
				// the subtree that is about to become `inert`.
				toggleOpen();
				return;
			}

			// "clear" only fires while the terminal input itself has focus.
			if (document.activeElement !== inputRef.current) return;
			event.preventDefault();
			clearTerminal();
		};

		window.addEventListener("keydown", onWindowKeyDown);
		return () => window.removeEventListener("keydown", onWindowKeyDown);
	}, [open, toggleOpen, clearTerminal]);

	return (
		<div className="shrink-0 border-t border-divider bg-black text-xs">
			<button
				ref={toggleButtonRef}
				type="button"
				onClick={toggleOpen}
				aria-expanded={open}
				className="flex w-full items-center gap-1.5 px-4 py-2 text-accent"
			>
				{open ? (
					<ChevronDown className="size-3" />
				) : (
					<ChevronRight className="size-3" />
				)}
				TERMINAL
				{/* Hidden on narrow screens, where the hint is noise next to the label.
				    Spelled `Ctrl` rather than U+2303, which the latin font subset the
				    site serves does not carry.
				    The palette is overridden because shadcn's Kbd assumes `muted` is a
				    surface with `muted-foreground` on top; here `muted` is a dim text
				    colour used in 22 other places and `muted-foreground` is undefined,
				    so the defaults render green-on-slate. tailwind-merge drops them and
				    keeps the structural classes (h-5, min-w-5, centring, select-none).
				    `font-[inherit]` also undoes Kbd's `font-sans`, which would be the
				    only non-mono text on the page. */}
				<KbdGroup aria-hidden="true" className="ml-2 hidden sm:inline-flex">
					<Kbd className="border border-divider bg-transparent px-1.5 font-[inherit] text-[10px] text-mid">
						Ctrl + `
					</Kbd>
				</KbdGroup>
			</button>
			<div
				data-open={open || undefined}
				inert={!open}
				className="h-0 overflow-hidden transition-[height] duration-200 data-open:h-48"
			>
				<div ref={bodyRef} className="h-48 overflow-y-auto px-4 pb-2">
					{lines.map((line) => {
						const grid = gridClasses[line.kind];
						if (grid) {
							const [leftClass, rightClass] = grid;
							return (
								<div
									key={line.id}
									className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 py-1"
								>
									{line.text.split("\n").map((row) => {
										const [left, right] = row.split("\t");
										return (
											<Fragment key={left}>
												<span className={leftClass}>{left}</span>
												<span className={rightClass}>{right}</span>
											</Fragment>
										);
									})}
								</div>
							);
						}
						if (line.kind === "input") {
							return (
								<p key={line.id} className="text-subtle">
									<span className="text-accent">{PROMPT}</span> {line.text}
								</p>
							);
						}
						return (
							<p key={line.id} className={lineClass(line.kind)}>
								{line.text || " "}
							</p>
						);
					})}
					<div className="flex items-center gap-2">
						<span className="shrink-0 text-accent">{PROMPT}</span>
						<input
							ref={inputRef}
							value={input}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={onKeyDown}
							spellCheck={false}
							autoComplete="off"
							aria-label="Terminal input"
							className="flex-1 bg-transparent outline-none"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
