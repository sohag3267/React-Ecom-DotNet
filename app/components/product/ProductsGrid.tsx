"use client";

import type { Product } from "@/(app-routes)/products/model";
import { ProductCardItem } from "./ProductCardItem";
import { cn } from "@/lib/utils/utils";

interface ProductsGridProps {
	products: Product[];
	viewMode?: "grid" | "list";
}

export function ProductsGrid({
	products,
	viewMode = "grid",
}: ProductsGridProps) {
	return (
		<div
			className={cn(
				// Mobile always uses grid (2 cols even on smallest screens)
				"grid grid-cols-2 gap-3",
				// On md+ screens, list view becomes 1 column, grid stays multi-column
				viewMode === "grid"
					? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					: "md:grid-cols-1"
			)}
		>
			{products.map((product) => (
				<ProductCardItem key={product.id} product={product} />
			))}
		</div>
	);
}
