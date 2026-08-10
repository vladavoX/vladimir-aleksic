export interface ContactLink {
	/** Uppercase gutter label, also what the terminal `contact` command prints. */
	label: string;
	/** Human-readable value — the address or the bare URL, no scheme. */
	value: string;
	href: string;
	/** Opens in a new tab with `rel="noreferrer"`. */
	external?: boolean;
	/** Served from `public/` as a file download rather than a navigation. */
	download?: boolean;
}

export const CONTACT: ContactLink[] = [
	{
		label: "EMAIL",
		value: "valeksic1337@gmail.com",
		href: "mailto:valeksic1337@gmail.com",
	},
	{
		label: "GITHUB",
		value: "github.com/vladavoX",
		href: "https://github.com/vladavoX",
		external: true,
	},
	{
		label: "LINKEDIN",
		value: "linkedin.com/in/va99",
		href: "https://www.linkedin.com/in/va99",
		external: true,
	},
	{
		label: "CV",
		value: "cv.pdf",
		href: "/cv.pdf",
		download: true,
	},
];

export const LOCATION = "Novi Sad, RS";
export const TIME_ZONE = "Europe/Belgrade";
export const AVAILABILITY = "open to work · remote or Novi Sad";
