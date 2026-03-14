export type MetaModel = {
	current_page: number;
	per_page: number;
	total: number;
	last_page: number;
	from: number;
	to: number;
	path: string;
	links: MetaLinksModel[];
};
type MetaLinksModel = {
	url?: string;
	label?: string;
	page?: number;
	active?: boolean;
};
