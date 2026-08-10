const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "short",
	timeStyle: "short",
});

export function formatDate(date: Date) {
	return dateFormatter.format(date);
}
