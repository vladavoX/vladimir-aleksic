// Bumping this invalidates any payload written under a previous shape,
// instead of that old shape being misread as valid data.
const VERSION = 1;

export const TABS_STORAGE_KEY = "tabs";

interface StoredTabs {
	v: number;
	tabs: unknown[];
}

function isStoredTabs(value: unknown): value is StoredTabs {
	return (
		typeof value === "object" &&
		value !== null &&
		(value as { v?: unknown }).v === VERSION &&
		Array.isArray((value as { tabs?: unknown }).tabs)
	);
}

export function serializeTabs(tabs: Iterable<string>): string {
	return JSON.stringify({ v: VERSION, tabs: [...tabs] });
}

// Tolerant by design: storage can hold anything (a stale shape, hand-edited
// JSON, a future version of the site) so every check below falls back to []
// rather than throwing or rendering a nameless tab.
export function parseTabs(raw: string | null, knownRoutes: string[]): string[] {
	if (raw === null) return [];

	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}
	if (!isStoredTabs(parsed)) return [];

	const known = new Set(knownRoutes);
	const seen = new Set<string>();
	const tabs: string[] = [];
	for (const tab of parsed.tabs) {
		if (typeof tab !== "string" || seen.has(tab)) return [];
		seen.add(tab);
		if (known.has(tab)) tabs.push(tab);
	}
	return tabs;
}
