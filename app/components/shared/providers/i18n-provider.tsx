"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [i18nReady, setI18nReady] = useState(false);

	useEffect(() => {
		// Ensure i18n is initialized on client
		if (i18n.isInitialized) {
			setI18nReady(true);
		} else {
			i18n.on("initialized", () => {
				setI18nReady(true);
			});
		}
	}, []);

	if (!i18nReady) {
		return <div>{children}</div>; // Return children without i18n during SSR
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
