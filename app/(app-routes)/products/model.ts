// Product Review type
export interface ProductReview {
  id: number;
  rating: number;
  review: string;
  created_at: string;
  reviewer_name: string;
}

// Product Variant type
export interface ProductVariant {
  id: number;
  combination: string[];
  combination_text: string;
  sku: string;
  price: number;
  discount_price: number;
  stock: number;
}

// Product Color type
export interface ProductColor {
  id: number;
  value: string;
}

// Product Color Image type
export interface ProductColorImage {
  id: number;
  color: string;
  photo: string;
}

// Product Attribute type
export interface ProductAttribute {
  id: number;
  name: string;
  values: string[];
}

// Product Category type
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Rating Counts type
export interface RatingCounts {
  "5": number;
  "4": number;
  "3": number;
  "2": number;
  "1": number;
}

// Product type based on your API response
export interface Product {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  price: number;
  discounted_price: number;
  discount_type: string;
  discount_value: string;
  category: ProductCategory;
  brand: string;
  sku: string;
  tax: string; // Tax amount as string from API
  tax_type: "include" | "exclude"; // Whether tax is included or excluded from price
  stock: number;
  is_featured: boolean;
  today_deal: boolean;
  thumbnail_image: string;
  gallery_images: string[];
  colors: ProductColor[];
  colors_image: ProductColorImage[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  average_rating: number;
  total_reviews: number;
  rating_counts: RatingCounts;
  reviews: ProductReview[];
  related_products?: Product[];
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    meta: PaginationMeta;
  };
}

// Raw API response for /products endpoint (returns data as array directly)
export interface RawProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[]; // Array directly in data
  meta: PaginationMeta; // Meta at root level
}

// Raw API response for featured/top-selling/today-deal endpoints (returns data as array directly, no meta)
export interface RawFeaturedProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[]; // Array directly in data
}

// Raw API response for /product-details endpoint (returns product directly in data)
export interface RawSingleProductApiResponse {
  success: boolean;
  message: string;
  data: Product; // Product directly in data, not nested
  meta: unknown[];
}

// Single Product Response (normalized structure for application use)
export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: {
    product: Product;
  };
}
