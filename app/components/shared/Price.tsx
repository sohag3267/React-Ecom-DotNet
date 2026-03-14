"use client";

import { businessSettingsAtom } from "@/store/ui-atoms";
import { useAtomValue } from "jotai";

type Props = {
	amount: number | string;
};

export default function Price({ amount }: Props) {
	const businessSettings = useAtomValue(businessSettingsAtom);
	const currencyPosition = businessSettings?.currency_position ?? "left";

	amount =
		typeof amount === "number"
			? amount.toFixed(parseInt(businessSettings?.decimal_digits || "2"))
			: amount;
	return (
		<span>
			{currencyPosition === "left"
				? `${businessSettings?.currency || "$"}${amount}`
				: `${amount}${businessSettings?.currency || "$"}`}
		</span>
	);
}
