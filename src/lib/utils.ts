import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones.
 * Expected at this path by anything added with `shadcn add`.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
