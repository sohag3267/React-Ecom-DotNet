import PaymentFailed from "@/components/pages/PaymentFailedPage";
import { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/utils/seo.utils";
import { getBusinessSettings } from "@/components/shared/actions/business-settings";

export async function generateMetadata(): Promise<Metadata> {
	const businessSettings = await getBusinessSettings();

	return genMeta({
		title: "Payment Failed",
		description: "Your payment could not be processed.",
		noIndex: true,
		businessSettings,
	});
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PaymentFailedPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const params = await searchParams;
	const message = params.message;
	const orderId = params.order_id;
	const orderTrackingNo = params.order_tracking_no;

	return <PaymentFailed message={message} orderId={orderId} orderTrackingNo={orderTrackingNo} />;
}
