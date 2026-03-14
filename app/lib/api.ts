import { API_CONFIG } from "./config/api.config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  email_verified_at?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  category_id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  brand: string;
  sku: string;
  stock: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  images: Array<{
    id: number;
    url: string;
    alt: string;
    is_primary: boolean;
  }>;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  variants?: Array<{
    id: number;
    color: string;
    size: string;
    price: number;
    stock: number;
  }>;
  created_at: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  filters: {
    categories: Array<{
      id: number;
      name: string;
      product_count: number;
    }>;
    price_range: {
      min: number;
      max: number;
    };
  };
}

export interface CartItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
  variant_id?: number;
  variant?: {
    color: string;
    size: string;
  };
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total_items: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  currency: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    district: string;
  };
  items: Array<{
    id: number;
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant?: {
      color: string;
      size: string;
    };
  }>;
  estimated_delivery: string;
  created_at: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    const response = await fetch(url, {
      ...options,
      headers: config.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth APIs
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Product APIs
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search_key?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }): Promise<ApiResponse<ProductsResponse>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ""}`);
  }

  async getProduct(id: number): Promise<
    ApiResponse<{
      product: Product;
      related_products: Product[];
      reviews: any[];
    }>
  > {
    return this.request(`/products/${id}`);
  }

  // Cart APIs
  async getCart(): Promise<ApiResponse<{ cart: Cart }>> {
    return this.request("/cart");
  }

  async addToCart(data: {
    product_id: number;
    quantity: number;
    variant_id?: number;
  }): Promise<ApiResponse<{ cart_item: CartItem; cart_summary: any }>> {
    return this.request("/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Order APIs
  async createOrder(data: {
    shipping_address: {
      name: string;
      phone: string;
      address: string;
      city: string;
      postal_code: string;
      district: string;
    };
    billing_address: {
      name: string;
      phone: string;
      address: string;
      city: string;
      postal_code: string;
      district: string;
    };
    payment_method: string;
    notes?: string;
  }): Promise<ApiResponse<{ order: Order }>> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getOrders(params?: {
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/orders${query ? `?${query}` : ""}`);
  }
}

export const apiClient = new ApiClient(API_CONFIG.API_BASE_URL_V1);
