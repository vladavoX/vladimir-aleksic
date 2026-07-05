import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { files } from "#/files";
import {
	completeInput,
	type OutputLine,
	runCommand,
} from "#/terminal-commands";

const WHOAMI = "Vladimir Aleksic — Full-Stack Developer · Novi Sad, RS";
const PROMPT = "~/portfolio $";

type Entry = OutputLine & { id: number };

const WELCOME: Entry[] = [
	{ id: 0, kind: "output", text: "type 'help' to get started" },
];

const lineClass = (kind: OutputLine["kind"]) => {
	if (kind === "error") return "text-prompt";
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
		const { lines: result, effect } = runCommand(entry, {
			files,
			now: () => new Date(),
			whoami: WHOAMI,
		});

		if (effect?.type === "clear") {
			setLines([]);
		} else {
			const echo: OutputLine = { kind: "input", text: `${PROMPT} ${entry}` };
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

	const toggle = () => {
		const next = !open;
		setOpen(next);
		if (next) {
			requestAnimationFrame(() => {
				inputRef.current?.focus();
				scrollToBottom();
			});
		}
	};

	return (
		<div className="shrink-0 border-t border-divider bg-black text-xs">
			<button
				type="button"
				onClick={toggle}
				aria-expanded={open}
				className="flex w-full items-center gap-1.5 px-4 py-2 text-accent"
			>
				{open ? (
					<ChevronDown className="size-3" />
				) : (
					<ChevronRight className="size-3" />
				)}
				TERMINAL
			</button>
			<div
				data-open={open || undefined}
				inert={!open}
				className="h-0 overflow-hidden transition-[height] duration-200 data-open:h-48"
			>
				<div ref={bodyRef} className="h-48 overflow-y-auto px-4 pb-2">
					{lines.map((line) => (
						<p key={line.id} className={lineClass(line.kind)}>
							{line.text || " "}
						</p>
					))}
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
