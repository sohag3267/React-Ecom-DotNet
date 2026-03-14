"use client";

import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/shared/ui/card";
import { Label } from "@/components/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/shared/ui/radio-group";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { CreditCard, Shield } from "lucide-react";
import type { PaymentMethod } from "@/(app-routes)/checkout/model";

interface PaymentFormProps {
	paymentMethod: PaymentMethod;
	sameAsShipping: boolean;
	onPaymentMethodChange: (method: PaymentMethod) => void;
	onSameAsShippingChange: (same: boolean) => void;
}

export function PaymentForm({
	paymentMethod,
	sameAsShipping,
	onPaymentMethodChange,
	onSameAsShippingChange,
}: PaymentFormProps) {
	const { t } = useTranslation();

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<CreditCard className="w-5 h-5 mr-2" />
						{t("checkout.paymentInfo") || "Payment Information"}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="billing"
							checked={sameAsShipping}
							onCheckedChange={(checked) =>
								onSameAsShippingChange(checked === true)
							}
						/>
						<Label htmlFor="billing">
							{t("checkout.billingAddressSame") ||
								"Billing address same as shipping"}
						</Label>
					</div>

					<RadioGroup
						value={paymentMethod}
						onValueChange={(value: PaymentMethod) =>
							onPaymentMethodChange(value)
						}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="cash_on_delivery" id="cod" />
							<Label htmlFor="cod">
								{t("checkout.cashOnDelivery") ||
									"Cash on Delivery"}
							</Label>
						</div>
						{/* <div className="flex items-center space-x-2">
							<RadioGroupItem value="paypal" id="paypal" />
							<Label htmlFor="paypal">
								{t("checkout.paypal") || "PayPal"}
							</Label>
						</div> */}
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="stripe" id="stripe" />
							<Label htmlFor="stripe">
								{t("checkout.stripe") ||
									"Stripe (Credit/Debit Card)"}
							</Label>
						</div>
						{/* <div className="flex items-center space-x-2">
							<RadioGroupItem
								value="bank_transfer"
								id="bank_transfer"
							/>
							<Label htmlFor="bank_transfer">
								{t("checkout.bankTransfer") ||
									"Bank Transfer"}
							</Label>
						</div> */}
					</RadioGroup>

					{/* {paymentMethod === "stripe" && (
						<div className="space-y-4">
							<div>
								<Label htmlFor="cardNumber">
									{t("checkout.cardNumber") || "Card Number"}
								</Label>
								<Input
									id="cardNumber"
									placeholder={
										t("checkout.placeholders.cardNumber") ||
										"1234 5678 9012 3456"
									}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="expiry">
										{t("checkout.expiryDate") ||
											"Expiry Date"}
									</Label>
									<Input
										id="expiry"
										placeholder={
											t(
												"checkout.placeholders.expiryDate"
											) || "MM/YY"
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="cvv">
										{t("checkout.cvv") || "CVV"}
									</Label>
									<Input
										id="cvv"
										placeholder={
											t("checkout.placeholders.cvv") ||
											"123"
										}
										required
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="cardName">
									{t("checkout.nameOnCard") || "Name on Card"}
								</Label>
								<Input
									id="cardName"
									placeholder={
										t("checkout.placeholders.nameOnCard") ||
										"Ahmed Rahman"
									}
									required
								/>
							</div>
						</div>
					)} */}
				</CardContent>
			</Card>

			<div className="flex items-center space-x-2 text-sm text-muted-foreground">
				<Shield className="w-4 h-4" />
				<span>
					{t("checkout.paymentSecure") ||
						"Your payment information is secure and encrypted"}
				</span>
			</div>
		</>
	);
}
