import { getAllCategories } from "@/components/shared/actions/categories";
import { Header } from "./Header";
import { Suspense } from "react";

export const HeaderWrapper = async () => {
	const response = await getAllCategories();

	const categories =
		response.success && response.data.categories
			? response.data.categories.filter((cat) => cat.parent_id === null)
			: [];

	return (
		<Suspense>
			<Header categories={categories} />
		</Suspense>
	);
};
