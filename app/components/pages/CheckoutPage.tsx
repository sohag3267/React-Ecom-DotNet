"use client";

import {
	createPurchaseOrder,
	getShippingCost,
	getStripeRedirectLink,
	getCheckoutData,
} from "@/(app-routes)/checkout/action";
import type {
	BillingFormData,
	FormData,
	FormErrors,
	PaymentMethod,
	CheckoutDataProduct,
} from "@/(app-routes)/checkout/model";
import { hasFormErrors, validateFormData } from "@/(app-routes)/checkout/model";
import { Button } from "@/components/shared/ui/button";
import { toast } from "@/components/shared/ui/sonner";
import { useCart } from "@/contexts/CartContext";
import { miniProfileAtom } from "@/store/mini-profile.atom";
import { businessSettingsAtom } from "@/store/ui-atoms";
import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Import the new components
import { BillingAddressForm } from "../../(app-routes)/checkout/components/BillingAddressForm";
import { OrderSummary } from "../../(app-routes)/checkout/components/OrderSummary";
import { PaymentForm } from "../../(app-routes)/checkout/components/PaymentForm";
import { ShippingAddressForm } from "../../(app-routes)/checkout/components/ShippingAddressForm";
import { prepareOrderData } from "../../(app-routes)/checkout/helpers/checkout-helpers";
import { useEffect, useMemo } from "react";
import { ABSOLUTE_ROUTES } from "@/lib/absolute-routes";

export function CheckoutPage() {
	const { t } = useTranslation();
	const businessSettings = useAtomValue(businessSettingsAtom);
	const [paymentMethod, setPaymentMethod] =
		useState<PaymentMethod>("cash_on_delivery");
	const [sameAsShipping, setSameAsShipping] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [shippingCost, setShippingCost] = useState(0);
	const [estimatedDelivery, setEstimatedDelivery] = useState(0);
	const [isShippingFree, setIsShippingFree] = useState(false);
	const [isLocationBased, setIsLocationBased] = useState(false);
	const [formErrors, setFormErrors] = useState<FormErrors>({
		shipping: {},
		billing: {},
	});
	const [isLoadingPrices, setIsLoadingPrices] = useState(true);
	const [serverPrices, setServerPrices] = useState<CheckoutDataProduct[]>([]);
	const { items, clearCart, subtotal, tax } = useCart();
	const router = useRouter();
	const miniProfile = useAtomValue(miniProfileAtom);

	// Shipping form state
	const [formData, setFormData] = useState<FormData>({
		name: miniProfile?.name || "",
		email: miniProfile?.email || "",
		phone: miniProfile?.phone || "",
		address: "",
		city: "",
		postal: "",
		addressType: "Home",
		country: "",
		countryId: undefined,
		cityId: undefined,
		phoneCountryCode: "+880",
	});

	// Billing form state (separate state for billing address)
	const [billingData, setBillingData] = useState<BillingFormData>({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		postal: "",
		country: "",
		countryId: undefined,
		cityId: undefined,
		phoneCountryCode: "+880",
	});

	const handleInputChange = (
		field: keyof FormData,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user starts typing
		if (formErrors.shipping[field as keyof typeof formErrors.shipping]) {
			setFormErrors((prev) => ({
				...prev,
				shipping: {
					...prev.shipping,
					[field]: undefined,
				},
			}));
		}
		// If user fills phone or email, clear the other field's error (if it's the "Email or phone" error)
		if (field === "phone" && value) {
			if (formErrors.shipping.email === "Email or phone is required") {
				setFormErrors((prev) => ({
					...prev,
					shipping: {
						...prev.shipping,
						email: undefined,
					},
				}));
			}
		} else if (field === "email" && value) {
			if (formErrors.shipping.phone === "Email or phone is required") {
				setFormErrors((prev) => ({
					...prev,
					shipping: {
						...prev.shipping,
						phone: undefined,
					},
				}));
			}
		}
	};

	const handleBillingInputChange = (
		field: keyof BillingFormData,
		value: string | number
	) => {
		setBillingData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user starts typing
		if (formErrors.billing[field as keyof typeof formErrors.billing]) {
			setFormErrors((prev) => ({
				...prev,
				billing: {
					...prev.billing,
					[field]: undefined,
				},
			}));
		}
		// If user fills phone or email, clear the other field's error (if it's the "Email or phone" error)
		if (field === "phone" && value) {
			if (formErrors.billing.email === "Email or phone is required") {
				setFormErrors((prev) => ({
					...prev,
					billing: {
						...prev.billing,
						email: undefined,
					},
				}));
			}
		} else if (field === "email" && value) {
			if (formErrors.billing.phone === "Email or phone is required") {
				setFormErrors((prev) => ({
					...prev,
					billing: {
						...prev.billing,
						phone: undefined,
					},
				}));
			}
		}
	};

	// Clear billing errors when toggling "same as shipping"
	useEffect(() => {
		if (sameAsShipping) {
			setFormErrors((prev) => ({
				...prev,
				billing: {},
			}));
		}
	}, [sameAsShipping]);

	// Fetch actual prices from server on mount
	useEffect(() => {
		const fetchCheckoutData = async () => {
			if (items.length === 0) {
				setIsLoadingPrices(false);
				return;
			}

			setIsLoadingPrices(true);
			try {
				// Prepare request data from cart items
				const requestItems = items.map((item) => ({
					product_id: item.id,
					...(item.variant_id && { variant_id: item.variant_id }),
				}));

				const response = await getCheckoutData(requestItems);

				if (response.success && response.data?.products) {
					setServerPrices(response.data.products);
				} else {
					// If API fails, we'll fall back to client-side prices
					console.warn("Failed to fetch checkout data, using client-side prices");
				}
			} catch (error) {
				console.error("Error fetching checkout data:", error);
			} finally {
				setIsLoadingPrices(false);
			}
		};

		fetchCheckoutData();
	}, [items]);

	// Handle shipping data change (country/city selection)
	const handleShippingDataChange = async (
		countryId?: number,
		cityId?: number
	) => {
		if (!countryId || !cityId) {
			setShippingCost(0);
			setEstimatedDelivery(0);
			setIsShippingFree(false);
			setIsLocationBased(false);
			return;
		}

		try {
			// Check shipping type from business settings
			const shippingType = businessSettings?.shipping_type || "flat_rate";
			const freeShippingThreshold = parseInt(
				businessSettings?.free_shipping_on_over || "0"
			);
			const flatCost = parseInt(businessSettings?.flat_cost || "0");

			// Rule 1: If free_shipping_on_over is satisfied, shipping is free
			if (
				freeShippingThreshold > 0 &&
				subtotal >= freeShippingThreshold
			) {
				setShippingCost(0);
				setEstimatedDelivery(0);
				setIsShippingFree(true);
				setIsLocationBased(false);
				return;
			}

			// Rule 2: If shipping_type is flat_rate, use flat_cost
			if (shippingType === "flat_rate") {
				setShippingCost(flatCost);
				setEstimatedDelivery(0);
				setIsShippingFree(false);
				setIsLocationBased(false);
				return;
			}

			// Rule 3: If shipping_type is not flat_rate, use calculation based on country/city
			setIsLocationBased(true);
			const response = await getShippingCost(countryId, cityId);
			if (response.success && response.data) {
				setShippingCost(response.data.shipping_cost);
				setEstimatedDelivery(response.data.est_delivery_days);
				setIsShippingFree(false);
			} else {
				setShippingCost(0);
				setIsShippingFree(false);
			}
		} catch (error) {
			console.error("Failed to fetch shipping cost:", error);
			setShippingCost(0);
			setIsLocationBased(false);
		}
	};

	// Calculate total with dynamic shipping cost
	// Use server prices if available, otherwise fall back to client-side prices
	const calculatedSubtotal = useMemo(() => {
		if (serverPrices.length > 0) {
			// Calculate subtotal from server prices
			return items.reduce((total, item) => {
				const serverPrice = serverPrices.find(
					(sp) =>
						sp.product_id === item.id &&
						(sp.variant_id === (item.variant_id || 0))
				);
				if (serverPrice) {
					return total + serverPrice.discount_price * item.quantity;
				}
				// Fallback to client price if server price not found for this item
				return total + item.price * item.quantity;
			}, 0);
		}
		return subtotal;
	}, [serverPrices, items, subtotal]);

	const calculatedTax = useMemo(() => {
		if (serverPrices.length > 0) {
			// Calculate tax from server prices (tax is a percentage, e.g., "4.00" means 4%)
			return items.reduce((total, item) => {
				const serverPrice = serverPrices.find(
					(sp) =>
						sp.product_id === item.id &&
						(sp.variant_id === (item.variant_id || 0))
				);
				if (serverPrice) {
					// Tax is percentage: calculate tax amount from price
					const taxPercentage = parseFloat(serverPrice.tax);
					const itemTotal = serverPrice.discount_price * item.quantity;
					return total + (itemTotal * taxPercentage / 100);
				}
				// Fallback to client tax if server tax not found for this item
				return total + (item.tax || 0) * item.quantity;
			}, 0);
		}
		return tax;
	}, [serverPrices, items, tax]);

	const freeShippingThreshold = parseInt(
		businessSettings?.free_shipping_on_over || "0"
	);

	// Determine final shipping cost
	let finalShipping = shippingCost;

	// If free shipping threshold is met, shipping is free
	if (
		freeShippingThreshold > 0 &&
		calculatedSubtotal >= freeShippingThreshold
	) {
		finalShipping = 0;
	}

	const calculatedTotal = calculatedSubtotal + calculatedTax + finalShipping;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		const errors = validateFormData(formData, billingData, sameAsShipping);
		if (hasFormErrors(errors)) {
			setFormErrors(errors);
			toast.error(t("checkout.validationError") || "Validation Error", {
				description:
					t("checkout.pleaseFixErrors") ||
					"Please fix the errors above.",
			});
			return;
		}

		// Validate all required parameters before preparing order
		if (!formData || Object.keys(formData).length === 0) {
			toast.error(t("checkout.validationError") || "Validation Error", {
				description: "Shipping address is incomplete.",
			});
			return;
		}

		if (!billingData && !sameAsShipping) {
			toast.error(t("checkout.validationError") || "Validation Error", {
				description: "Billing address is incomplete.",
			});
			return;
		}

		if (!paymentMethod) {
			toast.error(t("checkout.validationError") || "Validation Error", {
				description: "Please select a payment method.",
			});
			return;
		}

		if (!items || items.length === 0) {
			toast.error(t("checkout.validationError") || "Validation Error", {
				description: "Your cart is empty.",
			});
			return;
		}

		if (calculatedSubtotal === undefined || calculatedSubtotal === null) {
			toast.error(t("checkout.validationError") || "Validation Error", {
				description: "Unable to calculate order total.",
			});
			return;
		}

		// if (!miniProfile?.id) {
		// 	toast.error(t("checkout.error") || "Error", {
		// 		description: "You must be logged in to place an order.",
		// 	});
		// 	return;
		// }

		setIsProcessing(true);

		try {
			// All parameters validated, now prepare order data
			const orderData = prepareOrderData({
				formData,
				billingData,
				sameAsShipping,
				paymentMethod,
				cartItems: items,
				cartTotals: {
					subtotal: calculatedSubtotal,
					tax: calculatedTax,
					shipping: finalShipping,
				},
				shippingMethod: "standard",
				shippingDuration: estimatedDelivery,
				serverPrices: serverPrices.length > 0 ? serverPrices : undefined,
			});

			// Submit order
			const response = await createPurchaseOrder(orderData);
			if (response.success && response.data) {
				clearCart();

				if (paymentMethod === "stripe") {
					const stripeResponse = await getStripeRedirectLink(
						response.data.id
					);
					if (stripeResponse.success) {
						setTimeout(() => {
							window.location.href = stripeResponse.data;
						}, 0);
						return; // Stop execution here
					} else {
						throw new Error("Can't able to fetch stripe url");
					}
				}

				// For other payment methods, show success and redirect to success page
				toast.success(
					t("checkout.orderPlacedSuccess") ||
					"Order placed successfully!",
					{
						description: ` ${response.data?.order_number ||
							response.data?.order_id ||
							response.data?.order_tracking_number ||
							"N/A"
							} - ${t("checkout.orderPlacedDescription") ||
							"Thank you for your purchase."
							}`,
					}
				);
				router.push(
					ABSOLUTE_ROUTES.PAYMENT_SUCCESS(
						response.data?.order_tracking_number || ""
					)
				);
			} else {
				toast.error(t("checkout.orderFailed") || "Order failed", {
					description:
						response.error ||
						t("checkout.orderFailedDescription") ||
						"Failed to create order. Please try again.",
				});
			}
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error(t("checkout.error") || "Error", {
				description:
					t("checkout.unexpectedError") ||
					"An unexpected error occurred. Please try again.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	if (items.length === 0) {
		return (
			<main className="container mx-auto px-4 py-16">
				<div className="text-center max-w-md mx-auto">
					<h1 className="text-2xl font-bold mb-2">
						{t("checkout.noItemsToCheckout") ||
							"No items to checkout"}
					</h1>
					<p className="text-muted-foreground mb-6">
						{t("checkout.emptyCartDescription") ||
							"Your cart is empty. Add some items before proceeding to checkout."}
					</p>
					<Button asChild>
						<Link href="/products">
							{t("checkout.continueShopping") ||
								"Continue Shopping"}
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
				<Link href="/cart" className="hover:text-foreground">
					{t("checkout.cart") || "Cart"}
				</Link>
				<span>/</span>
				<span className="text-foreground">
					{t("checkout.title") || "Checkout"}
				</span>
			</div>

			<Button variant="ghost" className="mb-6" asChild>
				<Link href="/cart">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("checkout.backToCart") || "Back to Cart"}
				</Link>
			</Button>

			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						{/* Shipping Address Form */}
						<ShippingAddressForm
							formData={formData}
							onInputChange={handleInputChange}
							onShippingDataChange={handleShippingDataChange}
							errors={formErrors.shipping}
						/>

						{/* Billing Address Form - Only show if not same as shipping */}
						{!sameAsShipping && (
							<BillingAddressForm
								billingData={billingData}
								onInputChange={handleBillingInputChange}
								errors={formErrors.billing}
							/>
						)}

						{/* Payment Form */}
						<PaymentForm
							paymentMethod={paymentMethod}
							sameAsShipping={sameAsShipping}
							onPaymentMethodChange={setPaymentMethod}
							onSameAsShippingChange={setSameAsShipping}
						/>

						{/* Shipping Method Form */}
						{/* <ShippingMethodForm
							shippingMethod={shippingMethod}
							onShippingMethodChange={setShippingMethod}
						/> */}
					</div>

					<div>
						{/* Order Summary */}
						<OrderSummary
							isProcessing={isProcessing}
							onSubmit={() => { }}
							shippingCost={finalShipping}
							estimatedDelivery={estimatedDelivery}
							subtotal={calculatedSubtotal}
							tax={calculatedTax}
							total={calculatedTotal}
							isFormValid={!hasFormErrors(formErrors)}
							isShippingFree={isShippingFree}
							isLocationBased={isLocationBased}
							isLoadingPrices={isLoadingPrices}
						/>
					</div>
				</div>
			</form>
		</main>
	);
}