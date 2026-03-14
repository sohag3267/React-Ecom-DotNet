"use client";

import { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Checkbox } from "@/components/shared/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shared/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/(app-routes)/(auth)/action";
import { useSetAtom } from "jotai";
import { miniProfileAtom } from "@/store/mini-profile.atom";
import { toast } from "sonner";
import { ABSOLUTE_ROUTES } from "@/lib/absolute-routes";
import { useTranslation } from "react-i18next";
import { COUNTRY_CODES } from "@/lib/constants/country-codes";

const STORAGE_KEY = "loginCredentials";

interface StoredCredentials {
	usePhone: boolean;
	email?: string;
	phone?: string;
	countryCode?: string;
	rememberMe: boolean;
}

const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
	const digitsOnly = phone.replace(/\D/g, "");
	const countryInfo = COUNTRY_CODES.find((cc) => cc.code === countryCode);

	if (!countryInfo) {
		return digitsOnly.length >= 7;
	}

	return (
		digitsOnly.length >= countryInfo.minDigits &&
		digitsOnly.length <= countryInfo.maxDigits
	);
};

const getPhoneValidationMessage = (countryCode: string): string => {
	const countryInfo = COUNTRY_CODES.find((cc) => cc.code === countryCode);

	if (!countryInfo) {
		return "Please enter a valid phone number";
	}

	if (countryInfo.minDigits === countryInfo.maxDigits) {
		return `${countryInfo.country} phone numbers must be exactly ${countryInfo.minDigits} digits`;
	}

	return `${countryInfo.country} phone numbers must be between ${countryInfo.minDigits} and ${countryInfo.maxDigits} digits`;
};

const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export function LoginPage() {
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const [usePhoneNumber, setUsePhoneNumber] = useState(true);
	const [countryCode, setCountryCode] = useState("+880");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const setMiniProfile = useSetAtom(miniProfileAtom);
	const redirectUrl =
		useSearchParams().get("redirect") || ABSOLUTE_ROUTES.PROFILE;

	// Load stored credentials on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					const credentials: StoredCredentials = JSON.parse(stored);
					if (credentials.rememberMe) {
						setUsePhoneNumber(credentials.usePhone);
						if (credentials.usePhone) {
							setPhoneNumber(credentials.phone || "");
							setCountryCode(credentials.countryCode || "+880");
						} else {
							setEmail(credentials.email || "");
						}
						setRememberMe(true);
					}
				} catch (error) {
					console.error("Failed to load stored credentials:", error);
				}
			}
		}
	}, []);

	const handleToggleContactMethod = () => {
		if (usePhoneNumber) {
			// Switching to email
			setPhoneNumber("");
		} else {
			// Switching to phone
			setEmail("");
		}
		setUsePhoneNumber(!usePhoneNumber);
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow digits
		const value = e.target.value.replace(/\D/g, "");
		setPhoneNumber(value);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation based on contact method
		if (usePhoneNumber) {
			if (!validatePhoneNumber(phoneNumber, countryCode)) {
				toast.error(getPhoneValidationMessage(countryCode));
				return;
			}
		} else {
			if (!validateEmail(email)) {
				toast.error(
					t("login.invalidEmail") ||
						"Please enter a valid email address"
				);
				return;
			}
		}

		// Store credentials if remember me is checked
		if (rememberMe && typeof window !== "undefined") {
			const credentials: StoredCredentials = {
				usePhone: usePhoneNumber,
				rememberMe: true,
			};
			if (usePhoneNumber) {
				credentials.phone = phoneNumber;
				credentials.countryCode = countryCode;
			} else {
				credentials.email = email;
			}
			localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
		} else if (typeof window !== "undefined") {
			// Clear stored credentials if remember me is unchecked
			localStorage.removeItem(STORAGE_KEY);
		}

		startTransition(async () => {
			try {
				const loginData = usePhoneNumber
					? {
							phone: `${countryCode}${phoneNumber}`,
							password,
							rememberMe,
					  }
					: {
							email,
							password,
							rememberMe,
					  };

				const response = await loginUser(loginData);

				if (response.success) {
					setMiniProfile(response.data?.user ?? null);
					toast.success(
						t("login.loginSuccess") ||
							"Login successful! Redirecting..."
					);
					// Use router.push for client-side navigation
					// Add a small delay to ensure cookie is set before navigation
					await new Promise((resolve) => setTimeout(resolve, 100));
					router.push(redirectUrl);
					// Force a refresh to ensure auth state is properly initialized
					router.refresh();
				} else {
					toast.error(
						response.message ||
							t("login.loginFailed") ||
							"Login failed. Please try again."
					);
				}
			} catch (error) {
				console.error("Login error:", error);
				toast.error(
					t("login.loginError") ||
						"An error occurred during login. Please try again."
				);
			}
		});
	};

	return (
		<main className="container mx-auto px-4 py-12">
			<div className="max-w-md mx-auto">
				<Button
					variant="ghost"
					className="mb-6 -ml-4"
					onClick={() => router.back()}
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("common.back") || "Back"}
				</Button>

				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold">
							{t("login.title") || "Welcome Back"}
						</CardTitle>
						<p className="text-muted-foreground">
							{t("login.subtitle") || "Sign in to your account"}
						</p>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin} className="space-y-4">
							{/* Phone Number Section */}
							{usePhoneNumber && (
								<div className="space-y-2">
									<Label>
										{t("login.phoneNumber") ||
											"Phone Number"}
									</Label>
									<div className="flex gap-2">
										<Select
											value={countryCode}
											onValueChange={setCountryCode}
										>
											<SelectTrigger className="w-[120px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{COUNTRY_CODES.map(
													(cc, index) => (
														<SelectItem
															key={`${cc.isoCode}-${index}`}
															value={cc.code}
														>
															{cc.isoCode}(
															{cc.code})
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<Input
											id="phone"
											name="phone"
											type="tel"
											placeholder={
												t(
													"login.phoneNumberPlaceholder"
												) || "Enter phone number"
											}
											value={phoneNumber}
											onChange={handlePhoneChange}
											className="flex-1"
										/>
									</div>
									{phoneNumber && (
										<div className="text-xs">
											{(() => {
												const countryInfo =
													COUNTRY_CODES.find(
														(cc) =>
															cc.code ===
															countryCode
													);
												const digitsOnly =
													phoneNumber.replace(
														/\D/g,
														""
													);

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
									<div className="flex justify-end mt-2">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-sm underline h-auto p-0 italic text-blue-500 hover:bg-transparent"
											onClick={handleToggleContactMethod}
										>
											{t("login.useEmailInstead") ||
												"Use email instead"}
										</Button>
									</div>
								</div>
							)}

							{/* Email Section */}
							{!usePhoneNumber && (
								<div className="space-y-2">
									<Label htmlFor="email">
										{t("login.email") || "Email"}
									</Label>
									<Input
										id="email"
										type="email"
										placeholder={
											t("login.emailPlaceholder") ||
											"Enter your email"
										}
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
									<div className="flex justify-end mt-2">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-sm underline h-auto p-0 italic text-blue-500 hover:bg-transparent"
											onClick={handleToggleContactMethod}
										>
											{t("login.usePhoneInstead") ||
												"Use phone instead"}
										</Button>
									</div>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="password">
									{t("login.password") || "Password"}
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder={
											t("login.passwordPlaceholder") ||
											"Enter your password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="remember"
										checked={rememberMe}
										onCheckedChange={(checked) =>
											setRememberMe(checked as boolean)
										}
									/>
									<Label
										htmlFor="remember"
										className="text-sm"
									>
										{t("login.rememberMe") || "Remember me"}
									</Label>
								</div>
								{/* <Button variant="link" className="px-0 text-sm">
									{t("login.forgotPassword") ||
										"Forgot password?"}
								</Button> */}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isPending}
							>
								{isPending
									? t("login.signingIn") || "Signing In..."
									: t("login.signIn") || "Sign In"}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-muted-foreground">
								{t("login.noAccount") ||
									"Don't have an account?"}{" "}
							</span>
							<Link
								href="/register"
								className="text-primary hover:underline font-medium"
							>
								{t("login.signUp") || "Sign up"}
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
