import { COUNTRY_CODES, CountryCode } from "@/lib/constants/country-codes";

// Checkout data request/response types (for fetching actual prices from server)
export interface CheckoutDataRequestItem {
  product_id: number;
  variant_id?: number;
}

export interface CheckoutDataProduct {
  product_id: number;
  variant_id: number;
  discount_price: number;
  tax: string;
}

// Raw API response format (products at root level)
export interface CheckoutDataApiResponse {
  products: CheckoutDataProduct[];
}

// Normalized response format for internal use
export interface CheckoutDataResponse {
  success: boolean;
  message?: string;
  data?: {
    products: CheckoutDataProduct[];
  };
}

// Types for checkout addresses
export interface ShippingAddress {
  contact_person_name: string;
  phone: string;
  email: string;
  address_type: string;
  country: string;
  city: string;
  zip_code: string;
  address: string;
  is_billing: boolean;
}

// Country type
export interface Country {
  id: number;
  name: string;
  code: string;
}

// City type
export interface City {
  id: number;
  name: string;
}

// Shipping cost type
export interface ShippingCost {
  country_id: string | number;
  city_id: string | number;
  shipping_method: string;
  shipping_cost: number;
  est_delivery_days: number;
  free_shipping_over: number;
}

// API Response types
export interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: City[];
}

export interface ShippingCostResponse {
  success: boolean;
  message: string;
  data: ShippingCost;
}

export interface BillingAddress {
  contact_person_name: string;
  phone: string;
  email: string;
  address_type: string;
  country: string;
  city: string;
  zip_code: string;
  address: string;
}

// Order item type
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  variant_id: number;
}

// Cart item interface for type safety
export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  variant_id?: number;
}

// Purchase order request and response types
export interface PurchaseOrderRequest {
  total_price: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_method: ShippingMethod;
  shipping_cost: number;
  shipping_duration: number;
  total_vat_amount: number;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  order_items: OrderItem[];
}

export interface PurchaseOrderResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    order_tracking_number?: string;
    status: string;
    total: number;
    [key: string]: unknown;
  };
  error?: string;
}

// Component form data types
export interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cityId?: number;
  postal: string;
  addressType: string;
  country: string;
  countryId?: number;
  phoneCountryCode: string;
}

export interface BillingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cityId?: number;
  postal: string;
  country: string;
  countryId?: number;
  phoneCountryCode: string;
} // Payment method type
export type PaymentMethod =
  | "paypal"
  | "stripe"
  | "bank_transfer"
  | "cash_on_delivery";

// Shipping method type
export type ShippingMethod = "standard" | "express" | "overnight";

// Order status type
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Payment status type
export type PaymentStatus = "unpaid" | "paid" | "refunded";

// Component props types
export interface ShippingAddressFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export interface BillingAddressFormProps {
  billingData: BillingFormData;
  onInputChange: (field: keyof BillingFormData, value: string) => void;
}

export interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  sameAsShipping: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSameAsShippingChange: (same: boolean) => void;
}

export interface OrderSummaryProps {
  isProcessing: boolean;
  onSubmit: () => void;
  shippingCost?: number;
  estimatedDelivery?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
}

// Form validation types
export interface FormErrors {
  shipping: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
    city?: string;
    addressType?: string;
  };
  billing: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
    city?: string;
  };
}

// Validation helper
export function validateFormData(
  formData: FormData,
  billingData: BillingFormData,
  sameAsShipping: boolean
): FormErrors {
  const errors: FormErrors = {
    shipping: {},
    billing: {},
  };

  // Validate shipping address (postal is optional)
  if (!formData.name?.trim()) errors.shipping.name = "Name is required";

  // At least one of email or phone is required
  const hasEmail = formData.email?.trim();
  const hasPhone = formData.phone?.trim();

  if (!hasEmail && !hasPhone) {
    // Both are empty - show error message on both
    errors.shipping.email = "Email or phone is required";
    errors.shipping.phone = "Email or phone is required";
  } else {
    // At least one is provided - only validate the one that's filled
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.shipping.email = "Invalid email format";
    }
    // If phone is provided, validate phone format
    if (
      hasPhone &&
      !validatePhoneNumber(formData.phone, formData.phoneCountryCode)
    ) {
      errors.shipping.phone = getPhoneValidationMessage(
        formData.phoneCountryCode
      );
    }
  }

  if (!formData.address?.trim())
    errors.shipping.address = "Address is required";
  if (!formData.country?.trim())
    errors.shipping.country = "Country is required";
  if (!formData.city?.trim()) errors.shipping.city = "City is required";
  if (!formData.addressType?.trim())
    errors.shipping.addressType = "Address type is required";

  // Validate billing address if different from shipping
  if (!sameAsShipping) {
    if (!billingData.name?.trim()) errors.billing.name = "Name is required";

    // At least one of email or phone is required for billing
    const hasBillingEmail = billingData.email?.trim();
    const hasBillingPhone = billingData.phone?.trim();

    if (!hasBillingEmail && !hasBillingPhone) {
      errors.billing.email = "Email or phone is required";
      errors.billing.phone = "Email or phone is required";
    } else {
      // Validate email format only if provided
      if (
        hasBillingEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email)
      ) {
        errors.billing.email = "Invalid email format";
      }
      // If phone is provided, validate phone format
      if (
        hasBillingPhone &&
        !validatePhoneNumber(billingData.phone, billingData.phoneCountryCode)
      ) {
        errors.billing.phone = getPhoneValidationMessage(
          billingData.phoneCountryCode
        );
      }
    }

    if (!billingData.address?.trim())
      errors.billing.address = "Address is required";
    if (!billingData.country?.trim())
      errors.billing.country = "Country is required";
    if (!billingData.city?.trim()) errors.billing.city = "City is required";
  }

  return errors;
}

// Phone validation functions (imported from country-codes constant)
export function validatePhoneNumber(
  phone: string,
  countryCode: string
): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  const countryInfo = COUNTRY_CODES.find(
    (cc: CountryCode) => cc.code === countryCode
  );

  if (!countryInfo) {
    return digitsOnly.length >= 7;
  }

  return (
    digitsOnly.length >= countryInfo.minDigits &&
    digitsOnly.length <= countryInfo.maxDigits
  );
}

export function getPhoneValidationMessage(countryCode: string): string {
  const countryInfo = COUNTRY_CODES.find(
    (cc: CountryCode) => cc.code === countryCode
  );

  if (!countryInfo) {
    return "Please enter a valid phone number";
  }

  if (countryInfo.minDigits === countryInfo.maxDigits) {
    return `${countryInfo.country} phone numbers must be exactly ${countryInfo.minDigits} digits`;
  }

  return `${countryInfo.country} phone numbers must be between ${countryInfo.minDigits} and ${countryInfo.maxDigits} digits`;
}

export function hasFormErrors(errors: FormErrors): boolean {
  const shippingHasErrors = Object.values(errors.shipping).some((e) => e);
  const billingHasErrors = Object.values(errors.billing).some((e) => e);
  return shippingHasErrors || billingHasErrors;
}
