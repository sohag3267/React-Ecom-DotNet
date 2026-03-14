"use client";

import Price from "@/components/shared/Price";

interface ProductPriceProps {
	discountedPrice: number;
	originalPrice?: number;
}

export function ProductPrice({
	discountedPrice,
	originalPrice,
}: ProductPriceProps) {
	return (
		<div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
			<span className="text-xl sm:text-2xl lg:text-3xl font-bold">
				<Price amount={discountedPrice} />
			</span>
			{originalPrice && discountedPrice < originalPrice && (
				<span className="text-sm sm:text-base lg:text-lg text-muted-foreground line-through">
					<Price amount={originalPrice} />
				</span>
			)}
		</div>
	);
}
