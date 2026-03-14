import { Metadata } from "next";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { getUserProfile, clearAuthAndRedirect } from "./actions";
import ProfileLoading from "./loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserOrderHistory } from "./orders/actions";
import { generateMetadata as genMeta } from "@/lib/utils/seo.utils";
import { getBusinessSettings } from "@/components/shared/actions/business-settings";

export async function generateMetadata(): Promise<Metadata> {
	const businessSettings = await getBusinessSettings();

	return genMeta({
		title: "My Profile",
		description:
			"Manage your account settings, orders, and personal information.",
		noIndex: true,
		businessSettings,
	});
}

export default async function Profile() {
	const response = await getUserProfile();

	// If profile fetch fails, clear the invalid token and redirect to login
	if (!response.success) {
		await clearAuthAndRedirect();
		redirect("/login?redirect=/profile");
	}
	const orderHistory = await getUserOrderHistory();
	return (
		<div className="min-h-screen bg-background">
			<Suspense fallback={<ProfileLoading />}>
				<ProfilePage
					model={response.data}
					orderHistoryResponse={orderHistory}
				/>
			</Suspense>
		</div>
	);
}
