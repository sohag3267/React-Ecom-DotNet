import { Suspense } from "react";
import { getAllCategories } from "../shared/actions/categories";
import { Footer } from "./Footer";

export default async function FooterWrapper() {
	const response = await getAllCategories();

	const categories =
		response.success && response.data.categories
			? response.data.categories.filter((cat) => cat.parent_id === null)
			: [];

	return (
		<Suspense>
			<Footer categories={categories} />
		</Suspense>
	);
}
