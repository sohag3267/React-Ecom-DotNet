import { apiClient, type Cart, type CartItem, type ApiResponse } from "../api";

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  total: number;
  itemCount: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
}

export interface CartService {
  getCart(): Promise<ApiResponse<{ cart: Cart }>>;
  addToCart(
    data: AddToCartRequest
  ): Promise<ApiResponse<{ cart_item: CartItem; cart_summary: CartSummary }>>;
  updateCartItem(
    itemId: number,
    quantity: number
  ): Promise<ApiResponse<{ cart_item: CartItem; cart_summary: CartSummary }>>;
  removeFromCart(itemId: number): Promise<ApiResponse<{ message: string }>>;
  clearCart(): Promise<ApiResponse<{ message: string }>>;
}

class CartServiceImpl implements CartService {
  async getCart(): Promise<ApiResponse<{ cart: Cart }>> {
    return apiClient.getCart();
  }

  async addToCart(
    data: AddToCartRequest
  ): Promise<ApiResponse<{ cart_item: CartItem; cart_summary: CartSummary }>> {
    return apiClient.addToCart(data);
  }

  async updateCartItem(
    itemId: number,
    quantity: number
  ): Promise<ApiResponse<{ cart_item: CartItem; cart_summary: CartSummary }>> {
    const response = await fetch(`/api/cart/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async removeFromCart(
    itemId: number
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch("/api/cart/clear", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const cartService = new CartServiceImpl();
