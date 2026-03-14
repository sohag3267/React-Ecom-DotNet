"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
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
import { Truck, Loader2 } from "lucide-react";
import type { FormData, Country, City } from "@/(app-routes)/checkout/model";
import { getCountries, getCities } from "@/(app-routes)/checkout/action";
import { COUNTRY_CODES } from "@/lib/constants/country-codes";

interface ShippingAddressFormProps {
	formData: FormData;
	onInputChange: (field: keyof FormData, value: string | number) => void;
	onShippingDataChange?: (countryId?: number, cityId?: number) => void;
	errors?: Record<string, string | undefined>;
}

export function ShippingAddressForm({
	formData,
	onInputChange,
	onShippingDataChange,
	errors = {},
}: ShippingAddressFormProps) {
	const { t } = useTranslation();
	const [countries, setCountries] = useState<Country[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [loadingCountries, setLoadingCountries] = useState(true);
	const [loadingCities, setLoadingCities] = useState(false);

	// Fetch countries on mount
	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await getCountries();
				if (response.success) {
					setCountries(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch countries:", error);
			} finally {
				setLoadingCountries(false);
			}
		};

		fetchCountries();
	}, []);

	// Fetch cities when country changes
	useEffect(() => {
		if (formData.countryId) {
			const fetchCities = async () => {
				setLoadingCities(true);
				try {
					const response = await getCities(formData.countryId!);
					if (response.success) {
						setCities(response.data);
						// Reset city selection
						onInputChange("cityId", 0);
						onInputChange("city", "");
						if (onShippingDataChange) {
							onShippingDataChange(formData.countryId, undefined);
						}
					}
				} catch (error) {
					console.error("Failed to fetch cities:", error);
				} finally {
					setLoadingCities(false);
				}
			};

			fetchCities();
		}
	}, [formData.countryId]);

	// Notify parent when city changes
	useEffect(() => {
		if (formData.countryId && formData.cityId && onShippingDataChange) {
			onShippingDataChange(formData.countryId, formData.cityId);
		}
	}, [formData.cityId]);

	const handleCountryChange = (value: string) => {
		const selectedCountry = countries.find(
			(c) => c.id.toString() === value
		);
		if (selectedCountry) {
			onInputChange("countryId", selectedCountry.id);
			onInputChange("country", selectedCountry.name);
		}
	};

	const handleCityChange = (value: string) => {
		const selectedCity = cities.find((c) => c.id.toString() === value);
		if (selectedCity) {
			onInputChange("cityId", selectedCity.id);
			onInputChange("city", selectedCity.name);
		}
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow digits
		const value = e.target.value.replace(/\D/g, "");
		onInputChange("phone", value);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Truck className="w-5 h-5 mr-2" />
					{t("checkout.shippingInfo") || "Shipping Information"}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label
						htmlFor="name"
						className="flex items-center mb-1"
					>
						{t("checkout.name") || "Name"}
						<span className="text-red-500">*</span>
					</Label>
					<Input
						id="name"
						placeholder={
							t("checkout.placeholders.name") || "John Doe"
						}
						value={formData.name}
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
					<Label htmlFor="phone" className="flex items-center mb-1">
						{t("checkout.phone") || "Phone"}
					</Label>
					<div className="flex gap-2">
						<Select
							value={formData.phoneCountryCode}
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
							id="phone"
							placeholder={
								t("checkout.placeholders.phone") ||
								"Enter phone number"
							}
							value={formData.phone}
							onChange={handlePhoneChange}
							className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
						/>
					</div>
					{formData.phone && (
						<div className="text-xs">
							{(() => {
								const countryInfo = COUNTRY_CODES.find(
									(cc) =>
										cc.code === formData.phoneCountryCode
								);
								const digitsOnly =
									formData.phone.replace(/\D/g, "");

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
					<Label htmlFor="email" className="flex items-center mb-1">
						{t("checkout.email") || "Email"}
					</Label>
					<Input
						id="email"
						type="email"
						placeholder={
							t("checkout.placeholders.email") ||
							"john.doe@example.com"
						}
						value={formData.email}
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
							htmlFor="country"
							className="flex items-center mb-1"
						>
							{t("checkout.country") || "Country"}
							<span className="text-red-500">*</span>
						</Label>
						<Select
							disabled={loadingCountries}
							value={formData.countryId?.toString() || ""}
							onValueChange={handleCountryChange}
						>
							<SelectTrigger
								id="country"
								className={
									errors.country ? "border-red-500" : ""
								}
							>
								{loadingCountries ? (
									<span className="flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										{t("checkout.loading") || "Loading..."}
									</span>
								) : (
									<SelectValue
										placeholder={
											t("checkout.selectCountry") ||
											"Select Country"
										}
									/>
								)}
							</SelectTrigger>
							<SelectContent>
								{countries.map((country) => (
									<SelectItem
										key={country.id}
										value={country.id.toString()}
									>
										{country.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.country && (
							<p className="text-red-500 text-xs mt-1">
								{errors.country}
							</p>
						)}
					</div>
					<div>
						<Label
							htmlFor="city"
							className="flex items-center mb-1"
						>
							{t("checkout.city") || "City"}
							<span className="text-red-500">*</span>
						</Label>
						<Select
							disabled={
								loadingCities ||
								!formData.countryId ||
								cities.length === 0
							}
							value={formData.cityId?.toString() || ""}
							onValueChange={handleCityChange}
						>
							<SelectTrigger
								id="city"
								className={errors.city ? "border-red-500" : ""}
							>
								{loadingCities ? (
									<span className="flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										{t("checkout.loading") || "Loading..."}
									</span>
								) : (
									<SelectValue
										placeholder={
											t("checkout.selectCity") ||
											"Select City"
										}
									/>
								)}
							</SelectTrigger>
							<SelectContent>
								{cities.map((city) => (
									<SelectItem
										key={city.id}
										value={city.id.toString()}
									>
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.city && (
							<p className="text-red-500 text-xs mt-1">
								{errors.city}
							</p>
						)}
					</div>

					<div>
						<Label htmlFor="postal" className="flex mb-1">
							{t("checkout.postalCode") || "Postal Code"}
						</Label>
						<Input
							id="postal"
							placeholder={
								t("checkout.placeholders.postalCode") || "10001"
							}
							value={formData.postal}
							onChange={(e) =>
								onInputChange("postal", e.target.value)
							}
						/>
					</div>
				</div>
				<div>
					<Label htmlFor="address" className="flex items-center mb-1">
						{t("checkout.address") || "Address"}
						<span className="text-red-500">*</span>
					</Label>
					<Input
						id="address"
						placeholder={
							t("checkout.placeholders.address") ||
							"123 Main Street, Apt 4B"
						}
						value={formData.address}
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
