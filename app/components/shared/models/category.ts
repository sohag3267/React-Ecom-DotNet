export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  status: string;
  parent_id: string | null;
  child_category: ChildCategory[];
}

export interface ChildCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  status: string;
  parent_id: string;
  child_category?: ChildCategory[];
}

export interface CategoriesMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CategoriesData {
  categories: Category[];
  meta: CategoriesMeta;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: CategoriesData;
}

// Raw API response (what the backend actually returns)
export interface RawCategoriesApiResponse {
  success: boolean;
  message: string;
  data: Category[]; // Array directly in data
  meta: unknown[]; // Empty array at root level
}

export interface CategoriesQuery {
  page?: number;
  per_page?: number;
  status?: string;
}
