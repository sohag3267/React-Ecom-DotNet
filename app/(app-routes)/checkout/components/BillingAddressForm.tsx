"use client";

import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shared/ui/select";
import { FileText } from "lucide-react";
import type { BillingFormData } from "@/(app-routes)/checkout/model";
import { COUNTRY_CODES } from "@/lib/constants/country-codes";

interface BillingAddressFormProps {
	billingData: BillingFormData;
	onInputChange: (
		field: keyof BillingFormData,
		value: string | number
	) => void;
	errors?: Record<string, string | undefined>;
}

export function BillingAddressForm({
	billingData,
	onInputChange,
	errors = {},
}: BillingAddressFormProps) {
	const { t } = useTranslation();

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow digits
		const value = e.target.value.replace(/\D/g, "");
		onInputChange("phone", value);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<FileText className="w-5 h-5 mr-2" />
					{t("checkout.billingInfo") || "Billing Information"}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label
						htmlFor="billingName"
						className="flex items-center mb-1"
					>
						{t("checkout.name") || "Name"}
						<span className="text-red-500">*</span>
					</Label>
					<Input
						id="billingName"
						placeholder={
							t("checkout.placeholders.name") || "John Doe"
						}
						value={billingData.name}
						onChange={(e) =>
							onInputChange("name", e.target.value)
						}
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">
							{errors.name}
						</p>
					)}
				</div>

				<div>
					<Label
						htmlFor="billingPhone"
						className="flex items-center mb-1"
					>
						{t("checkout.phone") || "Phone"}
					</Label>
					<div className="flex gap-2">
						<Select
							value={billingData.phoneCountryCode}
							onValueChange={(value) =>
								onInputChange("phoneCountryCode", value)
							}
						>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{COUNTRY_CODES.map((cc, index) => (
									<SelectItem
										key={`${cc.isoCode}-${index}`}
										value={cc.code}
									>
										{cc.isoCode}({cc.code})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							id="billingPhone"
							placeholder={
								t("checkout.placeholders.phone") ||
								"Enter phone number"
							}
							value={billingData.phone}
							onChange={handlePhoneChange}
							className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
						/>
					</div>
					{billingData.phone && (
						<div className="text-xs">
							{(() => {
								const countryInfo = COUNTRY_CODES.find(
									(cc) =>
										cc.code === billingData.phoneCountryCode
								);
								const digitsOnly =
									billingData.phone.replace(/\D/g, "");

								if (!countryInfo) {
									return null;
								}

								const isValid =
									digitsOnly.length >=
									countryInfo.minDigits &&
									digitsOnly.length <=
									countryInfo.maxDigits;

								return (
									<p
										className={
											isValid
												? "text-green-600"
												: "text-red-500"
										}
									>
										{isValid ? "✓" : "✗"}{" "}
										{countryInfo.minDigits ===
											countryInfo.maxDigits
											? `${countryInfo.country}: ${countryInfo.minDigits} digits`
											: `${countryInfo.country}: ${countryInfo.minDigits}-${countryInfo.maxDigits} digits`}{" "}
										({digitsOnly.length})
									</p>
								);
							})()}
						</div>
					)}
					{errors.phone && (
						<p className="text-red-500 text-xs mt-1">
							{errors.phone}
						</p>
					)}
				</div>

				<div>
					<Label
						htmlFor="billingEmail"
						className="flex items-center mb-1"
					>
						{t("checkout.email") || "Email"}
					</Label>
					<Input
						id="billingEmail"
						type="email"
						placeholder={
							t("checkout.placeholders.email") ||
							"john.doe@example.com"
						}
						value={billingData.email}
						onChange={(e) => onInputChange("email", e.target.value)}
						className={errors.email ? "border-red-500" : ""}
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div>
						<Label
							htmlFor="billingCountry"
							className="flex items-center mb-1"
						>
							{t("checkout.country") || "Country"}
							<span className="text-red-500">*</span>
						</Label>
						<Input
							id="billingCountry"
							placeholder={
								t("checkout.placeholders.country") ||
								"United States"
							}
							value={billingData.country}
							onChange={(e) =>
								onInputChange("country", e.target.value)
							}
							className={errors.country ? "border-red-500" : ""}
						/>
						{errors.country && (
							<p className="text-red-500 text-xs mt-1">
								{errors.country}
							</p>
						)}
					</div>
					<div>
						<Label
							htmlFor="billingCity"
							className="flex items-center mb-1"
						>
							{t("checkout.city") || "City"}
							<span className="text-red-500">*</span>
						</Label>
						<Input
							id="billingCity"
							placeholder={
								t("checkout.placeholders.city") || "New York"
							}
							value={billingData.city}
							onChange={(e) =>
								onInputChange("city", e.target.value)
							}
							className={errors.city ? "border-red-500" : ""}
						/>
						{errors.city && (
							<p className="text-red-500 text-xs mt-1">
								{errors.city}
							</p>
						)}
					</div>

					<div>
						<Label htmlFor="billingPostal" className="flex mb-1">
							{t("checkout.postalCode") || "Postal Code"}
						</Label>
						<Input
							id="billingPostal"
							placeholder={
								t("checkout.placeholders.postalCode") || "10001"
							}
							value={billingData.postal}
							onChange={(e) =>
								onInputChange("postal", e.target.value)
							}
						/>
					</div>
				</div>
				<div>
					<Label
						htmlFor="billingAddress"
						className="flex items-center mb-1"
					>
						{t("checkout.address") || "Address"}
						<span className="text-red-500">*</span>
					</Label>
					<Input
						id="billingAddress"
						placeholder={
							t("checkout.placeholders.address") ||
							"123 Main Street, Apt 4B"
						}
						value={billingData.address}
						onChange={(e) =>
							onInputChange("address", e.target.value)
						}
						className={errors.address ? "border-red-500" : ""}
					/>
					{errors.address && (
						<p className="text-red-500 text-xs mt-1">
							{errors.address}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
