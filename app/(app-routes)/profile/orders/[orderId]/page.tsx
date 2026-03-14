import { Metadata } from "next";
import { getOrderDetails } from "../actions";
import OrderDetails from "./OrderDetails";
import OrderNotFound from "./OrderNotFound";
import { generateMetadata as genMeta } from "@/lib/utils/seo.utils";
import { getBusinessSettings } from "@/components/shared/actions/business-settings";

export async function generateMetadata(): Promise<Metadata> {
	const businessSettings = await getBusinessSettings();

	return genMeta({
		title: "Order Details",
		description:
			"View your order details and tracking information.",
		noIndex: true,
		businessSettings,
	});
}

interface OrderDetailsPageProps {
	params: Promise<{
		orderId: string;
	}>;
}

export default async function OrderDetailsPage({
	params,
}: OrderDetailsPageProps) {
	const { orderId } = await params;

	// Fetch order details from API
	const response = await getOrderDetails(orderId);
	if (!response.success || !response.data) {
		return <OrderNotFound />;
	}

	const orderDetails = response.data;

	return <OrderDetails orderDetails={orderDetails} />;
}
