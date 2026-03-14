"use client";

import { businessSettingsAtom } from "@/store/ui-atoms";
import { useAtomValue } from "jotai";

export default function HydrateFavicon() {
	const businessSettings = useAtomValue(businessSettingsAtom);
	return (
		<link rel="icon" href={businessSettings?.favicon ?? "/favicon.ico"} />
	);
}
