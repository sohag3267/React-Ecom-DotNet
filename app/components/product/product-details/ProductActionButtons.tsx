"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/shared/ui/button";
import { ShoppingCart, Heart, Share2, ShoppingBag } from "lucide-react";

interface ProductActionButtonsProps {
	onAddToCart: () => void;
	onBuyNow: () => void;
	onToggleWishlist: () => void;
	onShare: () => void;
	availableStock: number;
	isWishlisted: boolean;
	isWishlistLoading: boolean;
}

export function ProductActionButtons({
	onAddToCart,
	onBuyNow,
	onToggleWishlist,
	onShare,
	availableStock,
	isWishlisted,
	isWishlistLoading,
}: ProductActionButtonsProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-row gap-2">
			<Button
				onClick={onAddToCart}
				className="flex-1 h-9 text-xs"
				disabled={availableStock <= 0}
				variant="outline"
			>
				<ShoppingCart className="size-3.5 mr-1.5 sm:mr-2" />
				<span className="hidden sm:inline">
					{availableStock > 0
						? t("productDetails.addToCart") || "Add to Cart"
						: t("productDetails.outOfStock") || "Out of Stock"}
				</span>
			</Button>
			<Button
				onClick={onBuyNow}
				className="flex-1 h-9 text-xs"
				disabled={availableStock <= 0}
			>
				<ShoppingBag className="size-3.5 mr-1.5 sm:mr-2" />
				{t("productDetails.buyNow") || "Buy Now"}
			</Button>
			<Button
				variant="outline"
				onClick={onToggleWishlist}
				disabled={isWishlistLoading}
				className={`h-9 xs:w-auto px-3 ${isWishlisted ? "text-red-500 border-red-500" : ""
					}`}
				title={t("productDetails.wishlist") || "Add to wishlist"}
			>
				<Heart
					className={`size-3.5 ${isWishlisted ? "fill-current" : ""}`}
				/>
			</Button>
			<Button
				variant="outline"
				onClick={onShare}
				title={t("productDetails.shareProduct") || "Share this product"}
				className="h-9 xs:w-auto px-3"
			>
				<Share2 className="size-3.5" />
			</Button>
		</div>
	);
}