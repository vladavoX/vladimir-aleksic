import { Braces, Logs } from "lucide-react";

export const files = [
	{ icon: "M", name: "README.md", to: "/" },
	{ icon: <Braces className="size-3.5" />, name: "skills.json", to: "/skills" },
	{
		icon: <Logs className="size-3.5" />,
		name: "experience.log",
		to: "/experience",
	},
	{ icon: "M", name: "contact.md", to: "/contact" },
];

export const fileName = (to: string) =>
	files.find((file) => file.to === to)?.name;
