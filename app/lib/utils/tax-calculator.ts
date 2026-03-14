/**
 * Tax Calculator Utilities
 * Handles tax calculations for products with include/exclude tax types
 */

export interface TaxCalculationResult {
  subtotal: number; // Price without tax
  tax: number; // Tax amount
  total: number; // Final price (subtotal + tax or already included)
}

/**
 * Calculate tax for a single item
 * @param price - The item price (already discounted)
 * @param taxPercentage - Tax percentage from product (e.g., 10 for 10%)
 * @param taxType - Whether tax is "include" (included in price) or "exclude" (added to price)
 * @param quantity - Item quantity
 * @returns Object with subtotal, tax, and total
 */
export function calculateItemTax(
  price: number,
  taxPercentage: number,
  taxType: "include" | "exclude",
  quantity: number = 1
): TaxCalculationResult {
  const itemTotal = price * quantity;

  if (taxType === "include") {
    // Tax is already included in the price
    // We need to reverse-calculate the tax
    // Formula: tax_amount = itemTotal * (taxPercentage / (100 + taxPercentage))
    // subtotal = itemTotal / (1 + taxPercentage/100)
    const taxRate = taxPercentage / 100;
    const subtotal = itemTotal / (1 + taxRate);
    const totalTax = itemTotal - subtotal;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(totalTax * 100) / 100,
      total: itemTotal,
    };
  } else {
    // Tax is excluded from price - add it on top
    // tax = itemTotal * (taxPercentage / 100)
    const taxRate = taxPercentage / 100;
    const totalTax = itemTotal * taxRate;
    return {
      subtotal: itemTotal,
      tax: Math.round(totalTax * 100) / 100,
      total: Math.round((itemTotal + totalTax) * 100) / 100,
    };
  }
}

/**
 * Calculate total cart tax from multiple items
 * @param items - Array of cart items with price, quantity, tax, and tax_type
 * @returns Object with total subtotal, total tax, and grand total
 */
export function calculateCartTax(
  items: Array<{
    price: number;
    quantity: number;
    tax?: number;
    tax_type?: "include" | "exclude";
  }>
): TaxCalculationResult {
  let totalSubtotal = 0;
  let totalTax = 0;

  items.forEach((item) => {
    const taxAmount = item.tax ? parseFloat(item.tax.toString()) : 0;
    const taxType = item.tax_type || "exclude";

    const calculation = calculateItemTax(
      item.price,
      taxAmount,
      taxType,
      item.quantity
    );
    totalSubtotal += calculation.subtotal;
    totalTax += calculation.tax;
  });

  return {
    subtotal: totalSubtotal,
    tax: totalTax,
    total: totalSubtotal + totalTax,
  };
}
