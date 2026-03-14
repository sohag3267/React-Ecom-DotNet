"use client";

import { useTranslation } from "react-i18next";
import type { ProductVariant } from "@/(app-routes)/products/model";

interface ProductMetaProps {
	brand?: string;
	sku: string;
	selectedVariant?: ProductVariant | null;
}

export function ProductMeta({
	brand,
	sku,
	selectedVariant
}: ProductMetaProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-2.5 sm:space-y-5 text-xs sm:text-sm">
			{brand && (
				<div>
					<span className="font-medium">
						{t("productDetails.brand") || "Brand:"}{" "}
					</span>
					<span className="text-muted-foreground">{brand}</span>
				</div>
			)}

			<div>
				<span className="font-medium">
					{t("productDetails.sku") || "SKU:"}{" "}
				</span>
				<span className="text-muted-foreground">
					{selectedVariant ? selectedVariant.sku : sku}
				</span>
			</div>
		</div>
	);
}
