import type {
  FormData,
  BillingFormData,
  PaymentMethod,
  PurchaseOrderRequest,
  ShippingMethod,
  CheckoutDataProduct,
} from "@/(app-routes)/checkout/model";

// Types for cart items (assuming from CartContext)
interface CartItem {
  id: number;
  quantity: number;
  price: number;
  variant_id?: number;
}

// Types for totals calculation
interface CartTotals {
  subtotal: number;
  tax: number | null;
  shipping: number | null;
}

/**
 * Helper function to prepare shipping address
 */
export const prepareShippingAddress = (
  formData: FormData,
  isBilling: boolean,
) => {
  // Merge country code with phone number
  const fullPhoneNumber = formData.phone
    ? `${formData.phoneCountryCode}${formData.phone.replace(/\D/g, "")}`
    : "";

  return {
    contact_person_name: formData.name.trim(),
    phone: fullPhoneNumber,
    email: formData.email,
    address_type: formData.addressType,
    country: formData.country,
    city: formData.city,
    zip_code: formData.postal,
    address: formData.address,
    is_billing: isBilling,
  };
};

/**
 * Helper function to prepare billing address
 */
export const prepareBillingAddress = (
  formData: FormData,
  billingData: BillingFormData,
  sameAsShipping: boolean,
) => {
  if (sameAsShipping) {
    // Merge country code with phone number for shipping data
    const fullPhoneNumber = formData.phone
      ? `${formData.phoneCountryCode}${formData.phone.replace(/\D/g, "")}`
      : "";

    return {
      contact_person_name: formData.name.trim(),
      phone: fullPhoneNumber,
      email: formData.email,
      address_type: formData.addressType,
      country: formData.country,
      city: formData.city,
      zip_code: formData.postal,
      address: formData.address,
    };
  }

  // Merge country code with phone number for billing data
  const fullPhoneNumber = billingData.phone
    ? `${billingData.phoneCountryCode}${billingData.phone.replace(/\D/g, "")}`
    : "";

  return {
    contact_person_name: billingData.name.trim(),
    phone: fullPhoneNumber,
    email: billingData.email,
    address_type: "Home",
    country: billingData.country,
    city: billingData.city,
    zip_code: billingData.postal,
    address: billingData.address,
  };
};

/**
 * Helper function to prepare order items
 * Uses server prices if available, otherwise falls back to cart prices
 */
export const prepareOrderItems = (
  cartItems: CartItem[],
  serverPrices?: CheckoutDataProduct[],
) => {
  return cartItems.map((item) => {
    // Try to find server price for this item
    const serverPrice = serverPrices?.find(
      (sp) =>
        sp.product_id === item.id && sp.variant_id === (item.variant_id || 0),
    );

    return {
      product_id: item.id,
      quantity: item.quantity,
      price: serverPrice ? serverPrice.discount_price : item.price,
      variant_id: item.variant_id || 0,
    };
  });
};

/**
 * Helper function to calculate totals
 */
export const calculateTotals = (cartTotals: CartTotals) => {
  const vatAmount = cartTotals.tax || 0;
  const shippingCost = cartTotals.shipping || 0;
  const totalPrice = cartTotals.subtotal + vatAmount + shippingCost;

  return {
    vatAmount,
    shippingCost,
    totalPrice,
  };
};

/**
 * Main helper function to prepare complete order data
 */
export const prepareOrderData = (params: {
  formData: FormData;
  billingData: BillingFormData;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod;
  cartItems: CartItem[];
  cartTotals: CartTotals;
  shippingMethod: ShippingMethod;
  shippingDuration: number;
  serverPrices?: CheckoutDataProduct[];
}): PurchaseOrderRequest => {
  const {
    formData,
    billingData,
    sameAsShipping,
    paymentMethod,
    cartItems,
    cartTotals,
    shippingMethod = "standard",
    shippingDuration = 3,
    serverPrices,
  } = params;

  const totals = calculateTotals(cartTotals);

  return {
    total_price: totals.totalPrice,
    order_status: "pending",
    payment_status: "unpaid",
    payment_method: paymentMethod,
    shipping_method: shippingMethod,
    shipping_cost: totals.shippingCost,
    shipping_duration: shippingDuration,
    total_vat_amount: totals.vatAmount,
    shipping_address: prepareShippingAddress(formData, sameAsShipping),
    billing_address: prepareBillingAddress(
      formData,
      billingData,
      sameAsShipping,
    ),
    order_items: prepareOrderItems(cartItems, serverPrices),
  };
};
