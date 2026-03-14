// Individual business setting item type
export type BusinessSettingItem = {
  type: BusinessSettingType;
  value: string;
};

// All possible business setting types
export type BusinessSettingType =
  | "site_name"
  | "contact_email"
  | "contact_phone"
  | "country"
  | "timezone"
  | "pagination"
  | "address"
  | "decimal_digits"
  | "currency"
  | "currency_position"
  | "copyright_text"
  | "header_logo"
  | "footer_logo"
  | "favicon"
  | "maintenance_mode"
  | "shipping_type"
  | "flat_cost"
  | "decimal_separator"
  | "symbol_format"
  | "system_default_currency"
  | "product_number"
  | "customer_number"
  | "satisfaction_percentage"
  | "free_shipping_on_over"
  | "support_time"
  | "hero_image";

// Business settings as a normalized object (useful for lookups)
export type BusinessSettingsModel = {
  site_name: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  timezone: string;
  pagination: string;
  address: string;
  decimal_digits: string;
  currency: string;
  currency_position: "left" | "right";
  copyright_text: string;
  header_logo: string;
  footer_logo: string;
  favicon: string;
  maintenance_mode: "0" | "1";
  shipping_type: "flat_rate" | "free" | "calculated" | "location_based";
  flat_cost: string;
  decimal_separator: string;
  symbol_format: string;
  system_default_currency: string;
  product_number: string;
  customer_number: string;
  satisfaction_percentage: string;
  free_shipping_on_over: string;
  support_time: string;
  hero_image: string;
};

// API response can be array of BusinessSettingItem OR array of BusinessSettingsModel OR single BusinessSettingsModel
export type BusinessSettingsResponseModel = {
  success: boolean;
  message: string;
  data: BusinessSettingItem[] | BusinessSettingsModel[] | BusinessSettingsModel;
};
