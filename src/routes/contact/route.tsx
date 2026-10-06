import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	Copy,
	FileDown,
	Github,
	Linkedin,
	Mail,
	SquareArrowOutUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	AVAILABILITY,
	CONTACT,
	type ContactLink,
	LOCATION,
	TIME_ZONE,
} from "#/data/contact";
import { absoluteUrl, canonical } from "#/site";

const TITLE = "Contact — Vladimir Aleksic";
const DESCRIPTION =
	"Email, GitHub, LinkedIn and my CV, plus where I am and what I'm up for: open to work, remote or Novi Sad.";

export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: TITLE },
			{ name: "description", content: DESCRIPTION },
			{ property: "og:title", content: TITLE },
			{ property: "og:description", content: DESCRIPTION },
			{ property: "og:url", content: absoluteUrl("/contact") },
		],
		links: [canonical("/contact")],
	}),
	component: RouteComponent,
});

const icons: Record<string, React.ReactNode> = {
	EMAIL: <Mail className="size-3.5" />,
	GITHUB: <Github className="size-3.5" />,
	LINKEDIN: <Linkedin className="size-3.5" />,
	CV: <FileDown className="size-3.5" />,
};

const clockFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: TIME_ZONE,
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZoneName: "short",
});

// Empty on the server and the first client render so hydration matches, then
// filled in after mount and ticked every half minute.
function useNoviSadClock() {
	const [now, setNow] = useState("");

	useEffect(() => {
		const tick = () => setNow(clockFormatter.format(new Date()));
		tick();
		const id = setInterval(tick, 30_000);
		return () => clearInterval(id);
	}, []);

	return now;
}

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 1500);
		return () => clearTimeout(id);
	}, [copied]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
		} catch {
			// Clipboard access denied or unavailable (insecure context) — the value
			// is on screen and selectable, so there is nothing to recover from.
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			data-copied={copied || undefined}
			className="group/copy grid shrink-0 cursor-pointer p-1 text-muted transition-[color,scale] duration-150 ease-out hover:text-accent active:scale-[0.97]"
		>
			<span className="sr-only">{copied ? "Copied" : `Copy ${value}`}</span>
			{/* Both glyphs stay mounted in one grid cell and crossfade, so the swap
			    reads as one icon changing state rather than two trading places. */}
			<Copy
				aria-hidden="true"
				className="size-3.5 [grid-area:1/1] transition-[opacity,scale,filter] duration-200 ease-out-strong group-data-copied/copy:scale-50 group-data-copied/copy:opacity-0 group-data-copied/copy:blur-[2px]"
			/>
			<Check
				aria-hidden="true"
				className="size-3.5 [grid-area:1/1] scale-50 text-accent opacity-0 blur-[2px] transition-[opacity,scale,filter] duration-200 ease-out-strong group-data-copied/copy:scale-100 group-data-copied/copy:opacity-100 group-data-copied/copy:blur-[0px]"
			/>
		</button>
	);
}

function ContactRow({ link }: { link: ContactLink }) {
	const external = link.external ? { target: "_blank", rel: "noreferrer" } : {};

	// Below sm the value drops to its own full-width line rather than
	// truncating — the address is the whole point of the row.
	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm border border-divider bg-black p-3">
			<span className="flex w-4 shrink-0 justify-center text-accent-dim">
				{icons[link.label]}
			</span>
			<span className="w-20 shrink-0 text-xs text-muted">{link.label}</span>
			<a
				href={link.href}
				download={link.download}
				{...external}
				className="order-last flex w-full min-w-0 items-center gap-1.5 truncate text-host underline-offset-2 hover:underline sm:order-none sm:w-auto"
			>
				<span className="truncate">{link.value}</span>
				{link.external && (
					<SquareArrowOutUpRight className="size-3 shrink-0 text-muted" />
				)}
			</a>
			<span className="ml-auto flex shrink-0 items-center">
				<CopyButton value={link.external ? link.href : link.value} />
			</span>
		</div>
	);
}

function RouteComponent() {
	const now = useNoviSadClock();

	const status = [
		{ label: "BASED IN", value: LOCATION },
		{ label: "LOCAL TIME", value: now || "—" },
		{ label: "AVAILABILITY", value: AVAILABILITY },
		{ label: "USUAL REPLY", value: "within a day" },
	];

	return (
		<div className="bg-surface flex-1 *:mx-auto *:w-full *:max-w-5xl p-4 md:p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">Get in touch</h1>
				<p className="text-subtle text-sm max-w-[72ch]">
					Email is the fastest route — I read everything and answer real
					messages. Hiring, contract work, or a question about the After Effects
					plugin all land in the same inbox.
				</p>
			</div>

			<div className="space-y-3 pt-2">
				<h2 className="text-accent">
					<span aria-hidden="true" className="text-muted">
						##{" "}
					</span>
					REACH OUT
				</h2>
				<div className="grid gap-2 xl:grid-cols-2">
					{CONTACT.map((link) => (
						<ContactRow key={link.label} link={link} />
					))}
				</div>
				<p className="text-xs text-muted">
					Prefer the keyboard? Type <span className="text-accent">contact</span>{" "}
					in the terminal below.
				</p>
			</div>

			<div className="space-y-3 pt-2">
				<h2 className="text-accent">
					<span aria-hidden="true" className="text-muted">
						##{" "}
					</span>
					STATUS
				</h2>
				<div className="grid lg:grid-cols-2 gap-2">
					{status.map((item) => (
						<div
							key={item.label}
							className="p-4 bg-black rounded-sm border border-divider flex flex-col gap-2"
						>
							<p className="text-xs text-accent-dim">{item.label}</p>
							<p suppressHydrationWarning>{item.value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
