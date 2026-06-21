import { Braces, Logs, Type } from "lucide-react";

export const files = [
	{ icon: "M", name: "README.md", to: "/" },
	{ icon: <Type className="size-3.5" />, name: "now.txt", to: "/now" },
	{ icon: <Braces className="size-3.5" />, name: "skills.json", to: "/skills" },
	{
		icon: <Logs className="size-3.5" />,
		name: "experience.log",
		to: "/experience",
	},
];

export const fileName = (to: string) =>
	files.find((file) => file.to === to)?.name;
