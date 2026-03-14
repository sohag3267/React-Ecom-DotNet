"use server";

import { ApiClient } from "@/lib/api-client";
import { cookies } from "next/headers";
import { OrderDetailsModel, OrderResponseModel } from "./model";
import { API_ROUTES } from "@/lib/api-route";

export interface OrderItem {
  id: string;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  seller?: {
    name: string;
    type: string;
  };
}

export interface OrderDetails {
  id: string;
  order_number: string;
  order_date: string;
  status: string;
  delivery_type: string;
  shipping_address: {
    street: string;
    city: string;
    country: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    tax_fee: number;
    total: number;
  };
  payment_method: string;
  timeline: {
    status: string;
    date: string;
    active: boolean;
  }[];
}

export interface OrderDetailsResponse {
  order: OrderDetails;
}

export async function getOrderDetails(id: string) {
  return await new ApiClient(API_ROUTES.ORDER.ORDER_DETAILS)
    .withMethod("GET")
    .withCookieHeaders(await cookies())
    .withParams({ id })
    .execute<{
      success: boolean;
      message?: string;
      data: OrderDetailsModel | null;
    }>();
}

export interface Order {
  id: number;
  order_number?: string;
  status: string;
  total: number;
  created_at?: string;
  [key: string]: unknown;
}

export async function getUserOrders() {
  return await new ApiClient("orders")
    .withMethod("GET")
    .withCookieHeaders(await cookies())
    .execute<{ orders: Order[] }>();
}

export async function getUserOrderHistory(per_page?: string) {
  return await new ApiClient(API_ROUTES.ORDER.ORDER_HISTORIES)
    .withMethod("GET")
    .withCookieHeaders(await cookies())
    .withParams({ per_page: per_page ? per_page : 10 })
    .execute<OrderResponseModel>();
}

export interface ReviewPayload {
  product_id: number;
  rating: number;
  review: string;
}

export async function createReview(payload: ReviewPayload) {
  return await new ApiClient(API_ROUTES.REVIEWS.CREATE)
    .withMethod("POST")
    .withCookieHeaders(await cookies())
    .withBody(payload)
    .execute<{
      success: boolean;
      message?: string;
      data?: unknown;
    }>();
}
