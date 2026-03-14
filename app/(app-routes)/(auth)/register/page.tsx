import { RegisterPage } from "@/components/pages/RegisterPage";
import { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/utils/seo.utils";
import { getBusinessSettings } from "@/components/shared/actions/business-settings";

export async function generateMetadata(): Promise<Metadata> {
	const businessSettings = await getBusinessSettings();

	return genMeta({
		title: "Register",
		description:
			"Create a new account to start shopping and access exclusive deals.",
		noIndex: true,
		businessSettings,
	});
}

export default async function Register() {
	return (
		<div className="min-h-screen bg-background">
			<RegisterPage />
		</div>
	);
}
