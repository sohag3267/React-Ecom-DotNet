"use client";

import { useSearchParams } from "next/navigation";
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation";
import { Button } from "@/components/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaginationMeta } from "@/(app-routes)/products/model";

interface ProductPaginationProps {
	pagination: PaginationMeta;
}

export function ProductPagination({ pagination }: ProductPaginationProps) {
	const { t } = useTranslation();
	const router = useSmoothNavigation();
	const searchParams = useSearchParams();

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push(`/products?${params.toString()}`);
	};

	if (!pagination || pagination.last_page <= 1) {
		return null;
	}

	return (
		<div className="mt-8 flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(pagination.current_page - 1)}
				disabled={pagination.current_page === 1}
			>
				<ChevronLeft className="w-4 h-4 mr-1" />
				{t("products.previous") || "Previous"}
			</Button>
			<div className="flex items-center gap-1">
				{Array.from({ length: pagination.last_page }, (_, i) => i + 1)
					.filter((page) => {
						return (
							page === 1 ||
							page === pagination.last_page ||
							Math.abs(page - pagination.current_page) <= 1
						);
					})
					.map((page, index, array) => (
						<div key={page} className="flex items-center gap-1">
							{index > 0 && array[index - 1] !== page - 1 && (
								<span className="px-2">...</span>
							)}
							<Button
								variant={
									page === pagination.current_page
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						</div>
					))}
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(pagination.current_page + 1)}
				disabled={pagination.current_page === pagination.last_page}
			>
				{t("products.next") || "Next"}
				<ChevronRight className="w-4 h-4 ml-1" />
			</Button>
		</div>
	);
}
