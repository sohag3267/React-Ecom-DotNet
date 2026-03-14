"use client";

import { Button } from "@/components/shared/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CartHeaderProps {
	itemCount: number;
	onClearCart: () => void;
}

export function CartHeader({ itemCount, onClearCart }: CartHeaderProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div>
				<h1 className="text-2xl sm:text-3xl font-bold">
					{t("cart.title") || "Shopping Cart"}
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					{itemCount}{" "}
					{itemCount !== 1
						? t("cart.itemCountPlural") || "items"
						: t("cart.itemCount") || "item"}{" "}
					{t("cart.inYourCart") || "in your cart"}
				</p>
			</div>
			<Button
				variant="outline"
				onClick={onClearCart}
				className="text-destructive hover:text-destructive w-full sm:w-auto"
			>
				<Trash2 className="w-4 h-4 mr-2" />
				{t("cart.clearCart") || "Clear Cart"}
			</Button>
		</div>
	);
}
