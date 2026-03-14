// Google Analytics exports
export {
  GoogleAnalytics,
  trackPurchase,
  trackAddToCart,
  trackViewItem,
  trackSearch,
  trackBeginCheckout,
} from "./google-analytics";

// Meta Pixel exports
export {
  MetaPixel,
  trackMetaEvent,
  trackMetaPurchase,
  trackMetaAddToCart,
  trackMetaViewContent,
  trackMetaSearch,
  trackMetaInitiateCheckout,
  trackMetaLead,
  trackMetaCompleteRegistration,
  trackMetaAddToWishlist,
} from "./meta-pixel";

/**
 * Unified tracking functions that call both GA and Meta Pixel
 * Use these for convenience when you want to track on both platforms
 */
import {
  trackPurchase as trackGAPurchase,
  trackAddToCart as trackGAAddToCart,
  trackViewItem as trackGAViewItem,
  trackSearch as trackGASearch,
  trackBeginCheckout as trackGABeginCheckout,
  type GAPurchaseItem,
} from "./google-analytics";

import {
  trackMetaPurchase,
  trackMetaAddToCart,
  trackMetaViewContent,
  trackMetaSearch,
  trackMetaInitiateCheckout,
} from "./meta-pixel";

/**
 * Track purchase on both platforms
 */
export const trackUnifiedPurchase = (
  transactionId: string,
  value: number,
  currency: string = "USD",
  items: GAPurchaseItem[] = []
) => {
  // Google Analytics
  trackGAPurchase(transactionId, value, currency, items);

  // Meta Pixel
  const contentIds = items.map((item) => item.item_id);
  trackMetaPurchase(value, currency, contentIds);
};

/**
 * Track add to cart on both platforms
 */
export const trackUnifiedAddToCart = (
  itemId: string,
  itemName: string,
  price: number,
  quantity: number = 1
) => {
  // Google Analytics
  trackGAAddToCart(itemId, itemName, price, quantity);

  // Meta Pixel
  trackMetaAddToCart(itemId, itemName, price * quantity, "USD");
};

/**
 * Track product view on both platforms
 */
export const trackUnifiedViewProduct = (
  itemId: string,
  itemName: string,
  price: number,
  category?: string
) => {
  // Google Analytics
  trackGAViewItem(itemId, itemName, price, category);

  // Meta Pixel
  trackMetaViewContent(itemId, itemName, price, "USD", category);
};

/**
 * Track search on both platforms
 */
export const trackUnifiedSearch = (searchTerm: string) => {
  // Google Analytics
  trackGASearch(searchTerm);

  // Meta Pixel
  trackMetaSearch(searchTerm);
};

/**
 * Track checkout initiation on both platforms
 */
export const trackUnifiedBeginCheckout = (
  value: number,
  items: GAPurchaseItem[] = []
) => {
  // Google Analytics
  trackGABeginCheckout(value, items);

  // Meta Pixel
  const contentIds = items.map((item) => item.item_id);
  trackMetaInitiateCheckout(value, "USD", contentIds, items.length);
};
