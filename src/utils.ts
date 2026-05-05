const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "short",
	timeStyle: "short",
});

const timeZoneFormatter = new Intl.DateTimeFormat(undefined, {
	timeZoneName: "short",
});

export function formatDate(date: Date) {
	return dateFormatter.format(date);
}

export function getTimeZone(date: Date) {
	return (
		timeZoneFormatter
			.formatToParts(date)
			.find((part) => part.type === "timeZoneName")?.value ?? ""
	);
}
