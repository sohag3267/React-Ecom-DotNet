"use client";

import { Button } from "@/components/shared/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { businessSettingsAtom } from "@/store/ui-atoms";
import { formatNumberInThousand } from "@/lib/utils/utils";
import Price from "../shared/Price";

export const Hero = () => {
	const { t } = useTranslation();
	const businessSettings = useAtomValue(businessSettingsAtom);

	const scrollToDeals = () => {
		// Try to find today's deals section first, then featured products
		const dealsSection =
			document.getElementById("today-deals") ||
			document.getElementById("featured-products");

		if (dealsSection) {
			const offsetTop = dealsSection.offsetTop - 50; // Scroll 50px above the element
			window.scrollTo({
				top: offsetTop,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
			<div className="container mx-auto px-4 py-16 lg:py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						<div className="space-y-4">
							<h1 className="text-4xl lg:text-6xl font-bold leading-tight">
								{t("hero.title")}
							</h1>
							<p className="text-lg text-muted-foreground max-w-lg">
								{t("hero.subtitle")}
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button size="lg" className="text-lg px-8" asChild>
								<Link href="/products">
									<ShoppingBag className="mr-2 h-5 w-5" />
									{t("hero.shopNow")}
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="text-lg px-8"
								onClick={scrollToDeals}
							>
								{t("hero.exploreDeals")}
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-8 pt-8 border-t">
							<div className="text-center">
								<div className="text-2xl font-bold text-primary">
									{formatNumberInThousand(
										parseInt(
											businessSettings?.product_number ||
												"10000"
										)
									)}
								</div>
								<div className="text-sm text-muted-foreground">
									{t("hero.stats.products")}
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-primary">
									{formatNumberInThousand(
										parseInt(
											businessSettings?.customer_number ||
												"50000"
										)
									)}
								</div>
								<div className="text-sm text-muted-foreground">
									{t("hero.stats.customers")}
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-primary">
									{businessSettings?.satisfaction_percentage ||
										"99"}
									%
								</div>
								<div className="text-sm text-muted-foreground">
									{t("hero.stats.satisfaction")}
								</div>
							</div>
						</div>
					</div>

					{/* Right Content - Hero Image */}
					<div className="relative">
						<div className="relative ">
							<Image
								src={
									businessSettings?.hero_image ??
									"https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
								}
								alt={t("hero.imageAlt")}
								className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
								width={2070}
								height={500}
							/>
						</div>

						{/* Floating Cards */}
						<div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border z-20">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
									<ShoppingBag className="w-6 h-6 text-primary" />
								</div>
								<div>
									<div className="font-semibold">
										{t("hero.features.freeShipping")}
									</div>
									<div className="text-sm text-muted-foreground">
										{t("hero.features.onOrdersOver")}{" "}
										<Price
											amount={
												businessSettings?.free_shipping_on_over ||
												50
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg border z-20">
							<div className="text-center">
								<div className="text-2xl font-bold text-primary">
									{businessSettings?.support_time || "24/7"}
								</div>
								<div className="text-sm text-muted-foreground">
									{t("hero.features.support")}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Background Elements */}
			<div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
		</section>
	);
};
