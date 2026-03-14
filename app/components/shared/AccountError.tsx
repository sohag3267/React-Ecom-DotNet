"use client";

import { useTranslation } from "react-i18next";

type Props = {
	message?: string;
	status?: number;
};

export default function AccountError({ message, status }: Props) {
	const { t } = useTranslation();
	return (
		<div>
			<h2 className="text-red-500 text-2xl font-bold">
				{t("accountError.error") || "Error"} {status}
			</h2>
			<p className="text-red-500 text-lg font-semibold">
				{message ??
					(t("accountError.defaultMessage") ||
						"An error occurred. Please try again later.")}
			</p>
		</div>
	);
}
