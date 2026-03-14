import {
	getFeaturedProducts,
	getTopSellingProducts,
	getTodayDealProducts,
} from "@/(app-routes)/products/action";
import { ProductsGrid } from "../product/ProductsGrid";
import { SectionHeader } from "./SectionHeader";
import { SectionFooter } from "./SectionFooter";

interface ProductSectionProps {
	type: "featured" | "top-selling" | "today-deals";
	titleKey: string;
	descriptionKey: string;
	viewAllHref: string;
	perPage?: number;
	bgClass?: string;
	id?: string;
}

export async function ProductSection({
	type,
	titleKey,
	descriptionKey,
	viewAllHref,
	perPage = 12,
	bgClass = "",
	id,
}: ProductSectionProps) {
	try {
		let response;

		// Use the appropriate server action based on type
		switch (type) {
			case "featured":
				response = await getFeaturedProducts(perPage);
				break;
			case "top-selling":
				response = await getTopSellingProducts(perPage);
				break;
			case "today-deals":
				response = await getTodayDealProducts(perPage);
				break;
			default:
				return null;
		}

		// Check if response is valid and has products
		if (!response.success || !response.data?.products || response.data.products.length === 0) {
			return null;
		}

		return (
			<section
				id={id}
				className={`py-6 md:py-12 px-3 md:px-6 lg:px-8 ${bgClass}`}
			>
				<div className="md:container mx-auto">
					<SectionHeader
						titleKey={titleKey}
						descriptionKey={descriptionKey}
					/>
					<ProductsGrid products={response.data.products} />
					<SectionFooter viewAllHref={viewAllHref} />
				</div>
			</section>
		);
	} catch (error) {
		console.error(`Error in ProductSection for ${type}:`, error);
		return null;
	}
}
