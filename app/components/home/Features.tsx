"use client";

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { useTranslation } from "react-i18next";
import Price from "../shared/Price";
import { useAtomValue } from "jotai";
import { businessSettingsAtom } from "@/store/ui-atoms";

export const Features = () => {
	const { t } = useTranslation();

	const features = [
		{
			icon: Truck,
			titleKey: "features.freeShipping.title",
			descriptionKey: "features.freeShipping.description",
			isFreeShipping: true,
		},
		{
			icon: Shield,
			titleKey: "features.securePayment.title",
			descriptionKey: "features.securePayment.description",
		},
		{
			icon: RotateCcw,
			titleKey: "features.easyReturns.title",
			descriptionKey: "features.easyReturns.description",
		},
		{
			icon: Headphones,
			titleKey: "features.support.title",
			descriptionKey: "features.support.description",
		},
	];
	const businessSettings = useAtomValue(businessSettingsAtom);
	return (
		<section className="py-16 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="text-center border-0 shadow-sm bg-background/50 backdrop-blur hover:shadow-md transition-shadow"
						>
							<CardContent className="pt-8 pb-6">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<feature.icon className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t(feature.titleKey)}
								</h3>
								<div className="text-sm text-muted-foreground">
									{feature.isFreeShipping ? (
										<div className="flex gap-1 flex-wrap">
											{t(
												"features.freeShipping.firstTitle"
											)}{" "}
											<Price
												amount={(
													businessSettings?.free_shipping_on_over ??
													0
												).toString()}
											/>
											{t(
												"features.freeShipping.secondTitle"
											)}
										</div>
									) : (
										t(feature.descriptionKey)
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};
