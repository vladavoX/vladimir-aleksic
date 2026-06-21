import { buildJsonLines, type TokenKind } from "#/json-lines";

const tokenClass: Record<TokenKind, string> = {
	key: "text-accent",
	string: "text-prompt",
	number: "text-host",
	bool: "text-host",
	null: "text-host",
	punct: "text-muted",
	plain: "",
};

export function JsonViewer({ value }: { value: unknown }) {
	const lines = buildJsonLines(value);
	// monospace gutter wide enough for the largest line number
	const gutterCh = String(lines.length).length + 2;

	return (
		<div className="text-xs leading-6 py-2">
			{lines.map((line, i) => {
				const lineNo = i + 1;
				// column offset gives each token a stable, unique key within the line
				let col = 0;
				return (
					<div key={`L${lineNo}`} className="flex hover:bg-white/[0.02]">
						<span
							className="select-none shrink-0 pr-4 text-right text-muted tabular-nums"
							style={{ width: `${gutterCh}ch` }}
						>
							{lineNo}
						</span>
						<code className="whitespace-pre pr-4">
							{line
								.filter((token) => token.text)
								.map((token) => {
									const key = `${lineNo}:${col}`;
									col += token.text.length;
									return (
										<span key={key} className={tokenClass[token.kind]}>
											{token.text}
										</span>
									);
								})}
						</code>
					</div>
				);
			})}
		</div>
	);
}
