export const generateCategorySearchParams = (
	currentCategoryIds: string | null,
	id: number | string
) => {
	let currentSearchParams: string;

	// If no current IDs, just use the new id
	if (currentCategoryIds === null) {
		currentSearchParams = id.toString();
	}
	// If the ID already exists in the list, keep current params unchanged
	else if (currentCategoryIds.split(",").map(Number).includes(Number(id))) {
		currentSearchParams = currentCategoryIds;
	}
	// Otherwise, append the new id to the existing list
	else {
		currentSearchParams = `${currentCategoryIds},${id}`;
	}

	return encodeURIComponent(currentSearchParams);
};
