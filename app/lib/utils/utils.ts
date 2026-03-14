import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ORDER_STATUS } from "../enums";
import { BadgeVariant } from "@/components/shared/ui/badge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBadgeVariant(status: string) {
	const variant: BadgeVariant =
		status === ORDER_STATUS.DELIVERED
			? "default"
			: status === ORDER_STATUS.SHIPPED
			? "secondary"
			: status === ORDER_STATUS.PENDING
			? "warning"
			: status === ORDER_STATUS.PROCESSING
			? "accent"
			: "outline";
	return variant;
}

/**
 * Utility function to replace all occurrences of a character/string with another
 * @param text - The input string
 * @param search - The character/string to search for
 * @param replace - The character/string to replace with
 * @returns The modified string
 */
export function replaceAll(
	text: string,
	search: string,
	replace: string
): string {
	return text.replace(
		new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
		replace
	);
}

/**
 * Utility function to replace underscores with spaces
 * @param text - The input string
 * @returns The formatted string with underscores replaced by spaces
 */
export function formatText(text: string): string {
	return text.replace(/_/g, " ");
}

export function formatNumberInThousand(value: number) {
	if (value < 1000) return value;
	return value / 1000 + "K+";
}
