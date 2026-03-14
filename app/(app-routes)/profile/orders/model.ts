import { Product } from "@/(app-routes)/products/model";
import { MetaModel } from "@/components/shared/types/MetaModel";

export type OrderItemVariant = {
  id: number;
  product_id: number;
  combination: string[];
  price: string;
  sku: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  variant: OrderItemVariant | null;
  variant_id: number | null;
  product: Product;
};

export type OrderHistoryModel = {
  id: number;
  order_tracking_number: string;
  order_status?: string;
  payment_method?: string;
  payment_status?: string;
  shipping_method?: string;
  shipping_cost?: number;
  shipping_duration?: number;
  shipping_address?: string;
  order_placed?: string;
  total_amount?: number;
  products?: OrderItem[];
  order_histories?: MiniOrderHistory[];
  tax?: number;
  tax_type?: string;
};

export type OrderDetailsModel = OrderHistoryModel;

export type MiniOrderHistory = {
  id: number;
  status?: string;
  changed_at?: string;
};
export type OrderResponseModel = {
  success: boolean;
  message: string;
  data: OrderHistoryModel[];
  meta: MetaModel;
};

export type OrderDetailsResponseModel = {
  success: boolean;
  message: string;
  data: OrderDetailsModel[];
};
